import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch donations for a date range
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate required parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    // Parse dates for query
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999); // Set to end of day

    // Fetch transactions within the specified date range
    // We'll use the existing Transaction model instead of creating a new one
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDateTime,
          lte: endDateTime,
        },
        // Only include transactions created manually (for calendar entries)
        entryType: "MANUAL",
      },
      select: {
        id: true,
        userId: true, // Using the userId field from Transaction
        date: true,
        amount: true,
        transactionNature: true,
        description: true,
      },
    });

    // Format dates to YYYY-MM-DD for frontend compatibility
    const formattedDonations = transactions.map(transaction => ({
      id: transaction.id,
      userId: transaction.userId || "", // Handle null userId
      date: transaction.date.toISOString().split('T')[0],
      amount: transaction.amount,
      transactionNature: transaction.transactionNature,
      description: transaction.description,
    }));

    return NextResponse.json({
      success: true,
      donations: formattedDonations,
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}

// POST: Create or update donation entry
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { id, userId, date, amount, transactionNature, description } = body;

    // Validate required fields
    if (!userId || !date || amount === undefined || !transactionNature) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // We'll use the user information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fullname: true, email: true, mobile: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Generate a unique transaction ID
    const transactionId = `CALENDAR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create transaction data using the existing Transaction model
    const transactionData = {
      name: user.fullname || "Unknown User",
      email: user.email || "unknown@email.com",
      phone: user.mobile || "Unknown",
      userType: "INDIVIDUAL", // Default userType
      amount: Number(amount),
      type: "CASH", // Default type for calendar entries
      transactionId: id ? `${id}` : transactionId, // Use existing ID or generate new one
      date: new Date(date),
      transactionNature,
      description,
      entryType: "MANUAL", // This identifies it as a calendar entry
      entryBy: "ADMIN", // Since we're not using auth for now
      moneyFor: "OTHER", // Default category
      status: "VERIFIED", // Auto-verify calendar entries
      userId: userId, // Link to user
    };

    let result;

    // If ID exists, update existing transaction, otherwise create new one
    if (id) {
      result = await prisma.transaction.update({
        where: { id },
        data: {
          amount: Number(amount),
          transactionNature,
          description,
        },
      });
    } else {
      // Check if a transaction already exists for this user on this date with MANUAL entry type
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          userId,
          date: new Date(date),
          entryType: "MANUAL",
        },
      });

      if (existingTransaction) {
        // Update existing transaction if found
        result = await prisma.transaction.update({
          where: { id: existingTransaction.id },
          data: {
            amount: Number(amount),
            transactionNature,
            description,
          },
        });
      } else {
        // Create new transaction
        result = await prisma.transaction.create({
          data: transactionData,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Donation saved successfully",
      donationId: result.id,
    });
  } catch (error) {
    console.error("Error saving donation:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save donation" },
      { status: 500 }
    );
  }
}