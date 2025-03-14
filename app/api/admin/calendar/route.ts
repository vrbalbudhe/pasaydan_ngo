import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch donations for a date range
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    // Fetch transactions with user details
    const transactions = await prisma.transaction.findMany({
      where: {
         date: {
            gte: startDateTime,
            lte: endDateTime,
         },
         entryType: "MANUAL",
      },
      select: {
         id: true,
         userId: true,
         organizationId: true,
         date: true,
         amount: true,
         transactionNature: true,
         description: true,
         name: true, // Include manually entered name
         User: { select: { fullname: true } },
         Organization: { select: { name: true } },
      },
   });
   
   const formattedDonations = transactions.map(transaction => ({
      id: transaction.id,
      userId: transaction.userId || transaction.organizationId || "",
      userName: transaction.User?.fullname || transaction.Organization?.name || transaction.name || "Unknown User", 
      date: transaction.date.toISOString().split("T")[0],
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
    const body = await request.json();
    const { id, userId, date, amount, transactionNature, description } = body;

    if (!userId || !date || amount === undefined || !transactionNature) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fullname: true, email: true, mobile: true },
   });
   
   const organization = await prisma.organization.findUnique({
      where: { id: userId }, // Since userId might be organizationId
      select: { name: true, email: true, mobile: true },
   });

    const transactionId = `CALENDAR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const transactionData = {
      name: user?.fullname || organization?.name || body.name || "Unknown User", // Use transaction.name if no user/org
      email: user?.email || organization?.email || body.email || "unknown@email.com",
      phone: user?.mobile || organization?.mobile || body.phone || "Unknown",
      userType: user ? "INDIVIDUAL" : organization ? "ORGANIZATION" : "MANUAL_ENTRY",
      userId: user?.id || null,
      organizationId: organization?.id || null,
      amount: Number(amount),
      type: "CASH",
      transactionId: id ? `${id}` : transactionId,
      date: new Date(date),
      transactionNature,
      description,
      entryType: "MANUAL",
      entryBy: "ADMIN",
      moneyFor: "OTHER",
      status: "VERIFIED",
   };

    let result;

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
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          userId,
          date: new Date(date),
          entryType: "MANUAL",
        },
      });

      if (existingTransaction) {
        result = await prisma.transaction.update({
          where: { id: existingTransaction.id },
          data: {
            amount: Number(amount),
            transactionNature,
            description,
          },
        });
      } else {
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
