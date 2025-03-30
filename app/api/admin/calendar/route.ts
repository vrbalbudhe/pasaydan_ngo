import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        name: true,
        User: { select: { fullname: true } },
        Organization: { select: { name: true } },
      },
      orderBy: {
        date: "asc",
      },
    });

    const formattedDonations = transactions.map(transaction => ({
      id: transaction.id,
      userId: transaction.userId || transaction.organizationId || "",
      userName: transaction.name || 
               transaction.User?.fullname || 
               transaction.Organization?.name || 
               "Unknown User",
      date: transaction.date.toISOString().split("T")[0],
      amount: transaction.amount,
      transactionNature: transaction.transactionNature,
      description: transaction.description,
      name: transaction.name,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, name, date, amount, transactionNature, description } = body;

    if (!date || amount === undefined || !transactionNature) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let user = null;
    let organization = null;
    let finalName = name || "Unknown User";

    if (userId && userId !== "manual-entry") {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, fullname: true, email: true, mobile: true },
      });

      if (user) {
        finalName = user.fullname;
      } else {
        organization = await prisma.organization.findUnique({
          where: { id: userId },
          select: { id: true, name: true, email: true, mobile: true },
        });
        if (organization) {
          finalName = organization.name;
        }
      }
    }

    const transactionData = {
      name: finalName,
      email: user?.email || organization?.email || "unknown@email.com",
      phone: user?.mobile || organization?.mobile || "Unknown",
      userType: user ? "INDIVIDUAL" : organization ? "ORGANIZATION" : "INDIVIDUAL",
      userId: user?.id || null,
      organizationId: organization?.id || null,
      amount: Number(amount),
      type: "CASH",
      transactionId: id ? undefined : `CALENDAR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date(date),
      transactionNature,
      description,
      entryType: "MANUAL",
      entryBy: "ADMIN",
      moneyFor: "OTHER",
      status: "VERIFIED",
    };

    const result = id
      ? await prisma.transaction.update({
          where: { id },
          data: transactionData,
        })
      : await prisma.transaction.create({
          data: transactionData,
        });

    return NextResponse.json({
      success: true,
      message: "Donation saved successfully",
      donation: {
        id: result.id,
        userId: result.userId || result.organizationId || "",
        userName: finalName,
        date: result.date.toISOString().split("T")[0],
        amount: result.amount,
        transactionNature: result.transactionNature,
        description: result.description,
      },
    });
  } catch (error) {
    console.error("Error saving donation:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save donation" },
      { status: 500 }
    );
  }
}