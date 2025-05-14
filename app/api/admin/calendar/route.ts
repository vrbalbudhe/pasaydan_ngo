// app/api/admin/calendar/route.ts
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
            email: true,
            mobile: true,
          },
        },
        Organization: {
          select: {
            name: true,
            email: true,
            mobile: true,
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
      userId: transaction.userId || transaction.organizationId || null,
      date: transaction.date.toISOString().split('T')[0],
      amount: transaction.amount,
      transactionNature: transaction.transactionNature,
      description: transaction.description || "",
      // Explicitly pass all fields needed for proper display and editing
      userName: transaction.name || 
                (transaction.User?.fullname) || 
                (transaction.Organization?.name) || 
                "Unknown User",
      name: transaction.name,
      email: transaction.email,
      phone: transaction.phone,
      type: transaction.type, // Include payment type
      // Add additional fields that might be needed for complete updates
      transactionId: transaction.transactionId,
      userType: transaction.userType,
      status: transaction.status,
      moneyFor: transaction.moneyFor,
      customMoneyFor: transaction.customMoneyFor,
      entryType: transaction.entryType,
      entryBy: transaction.entryBy,
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
    console.log("Received calendar POST data:", data);
    
    // Check if it's an update (has ID) or a new donation
    const isUpdate = !!data.id;

    // Convert userType string to enum
    let userTypeValue = UserType.INDIVIDUAL;
    if (data.userType === "organization" || data.userType === "ORGANIZATION") {
      userTypeValue = UserType.ORGANIZATION;
    }
    
    // For update operations, use the transactions update API
    if (isUpdate) {
      // Call the transactions update API endpoint
      const updateResponse = await fetch(new URL('/api/admin/transactions/update', request.url).toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email || "manual@entry.com",
          phone: data.phone || "0000000000",
          userType: userTypeValue, // Use the enum value
          amount: parseFloat(data.amount),
          type: data.type || "CASH",
          transactionId: data.transactionId || `CAL-${Date.now()}`,
          date: new Date(data.date).toISOString(),
          transactionNature: data.transactionNature,
          description: data.description || null,
          status: "VERIFIED", // Calendar entries are always verified
          moneyFor: data.moneyFor || "OTHER",
          customMoneyFor: data.customMoneyFor || null,
          userId: data.userId !== "manual-entry" && data.userId ? data.userId : null,
          entryType: "MANUAL",
          entryBy: data.entryBy || "Calendar Admin",
        }),
      });

      const result = await updateResponse.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to update transaction");
      }

      // Format the response for the calendar
      const donation = {
        id: result.data.id,
        userId: result.data.userId || result.data.organizationId || null,
        date: new Date(result.data.date).toISOString().split('T')[0],
        amount: result.data.amount,
        transactionNature: result.data.transactionNature,
        description: result.data.description || "",
        userName: result.data.name,
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        type: result.data.type,
      };

      return NextResponse.json({ 
        success: true, 
        donation,
        message: "Donation updated successfully" 
      });
    } else {
      // For new donations, use the transactions create API
      const createResponse = await fetch(new URL('/api/admin/transactions', request.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name || data.userName || "Manual Entry",
          email: data.email || "manual@entry.com",
          phone: data.phone || "0000000000",
          userType: userTypeValue, // Use the enum value
          amount: parseFloat(data.amount),
          type: data.type || "CASH",
          transactionId: data.transactionId || `CAL-${Date.now()}`,
          date: new Date(data.date).toISOString(),
          transactionNature: data.transactionNature,
          description: data.description || null,
          status: "VERIFIED", // Calendar entries are always verified
          moneyFor: "OTHER",
          entryType: "MANUAL",
          entryBy: data.entryBy || "Calendar Admin",
          userId: data.userId !== "manual-entry" && data.userId ? data.userId : null,
        }),
      });

      const result = await createResponse.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to create transaction");
      }

      // Format the response for the calendar
      const donation = {
        id: result.data.id,
        userId: result.data.userId || result.data.organizationId || null,
        date: new Date(result.data.date).toISOString().split('T')[0],
        amount: result.data.amount,
        transactionNature: result.data.transactionNature,
        description: result.data.description || "",
        userName: result.data.name,
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        type: result.data.type,
      };

      return NextResponse.json({ 
        success: true, 
        donation,
        message: "Donation added successfully" 
      });
    }
  } catch (error) {
    console.error("Error saving donation:", error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to save donation" 
    }, { status: 500 });
  }
}