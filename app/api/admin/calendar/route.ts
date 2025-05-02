import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, TransactionType, TransactionNature, UserType, EntryType, TransactionStatus, MoneyForCategory } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json({ success: false, message: "Start and end dates are required" }, { status: 400 });
    }

    // Parse dates to ensure correct format for query
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    parsedEndDate.setHours(23, 59, 59, 999); // Set to end of day

    // Query transactions within the date range
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
      },
      include: {
        User: {
          select: {
            fullname: true,
          },
        },
        Organization: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Transform transactions to DonationEntry format for the calendar
    const donations = transactions.map(transaction => ({
      id: transaction.id,
      userId: transaction.userId || transaction.organizationId || transaction.id, // Use org ID if available
      date: transaction.date.toISOString().split('T')[0],
      amount: transaction.amount,
      transactionNature: transaction.transactionNature,
      description: transaction.description || "",
      // Handle various name sources to prevent "Unknown User"
      userName: transaction.name || 
                (transaction.User?.fullname) || 
                (transaction.Organization?.name) || 
                "Unknown User",
    }));

    return NextResponse.json({ success: true, donations });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch calendar data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Check if it's an update (has ID) or a new donation
    const isUpdate = !!data.id;
    
    // Prepare transaction data
    const transactionData = {
      name: data.name || data.userName || "Manual Entry", // Store custom name
      email: data.email || "manual@entry.com",
      phone: data.phone || "0000000000",
      userType: data.userType || "INDIVIDUAL" as UserType,
      amount: parseFloat(data.amount),
      type: "CASH" as TransactionType, // Default to CASH for calendar entries
      transactionId: data.id || `CAL-${Date.now()}`, // Generate transaction ID if new
      date: new Date(data.date),
      transactionNature: data.transactionNature as TransactionNature,
      entryType: "MANUAL" as EntryType,
      entryBy: data.entryBy || "Calendar Admin",
      status: "VERIFIED" as TransactionStatus,
      moneyFor: "OTHER" as MoneyForCategory,
      description: data.description || null,
      userId: data.userId !== "manual-entry" ? data.userId : null,
    };

    let transaction;
    
    if (isUpdate) {
      // Update existing transaction
      transaction = await prisma.transaction.update({
        where: { id: data.id },
        data: transactionData,
      });
    } else {
      // Create new transaction
      transaction = await prisma.transaction.create({
        data: transactionData,
      });
    }

    // Format response to match DonationEntry structure
    const donation = {
      id: transaction.id,
      userId: transaction.userId || transaction.id,
      date: transaction.date.toISOString().split('T')[0],
      amount: transaction.amount,
      transactionNature: transaction.transactionNature,
      description: transaction.description || "",
      userName: transaction.name || "Unknown User",
    };

    return NextResponse.json({ 
      success: true, 
      donation,
      message: isUpdate ? "Donation updated successfully" : "Donation added successfully" 
    });
  } catch (error) {
    console.error("Error saving donation:", error);
    return NextResponse.json({ success: false, message: "Failed to save donation" }, { status: 500 });
  }
}