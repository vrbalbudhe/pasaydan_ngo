// app/api/admin/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { TransactionType, EntryType } from "@prisma/client";
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const generatedTransactionId = nanoid(10).toUpperCase();

    // Prepare the data object with required fields
    const data = {
      ...body,
      transactionId: body.type === TransactionType.CASH 
        ? generatedTransactionId 
        : body.transactionId,
      date: new Date(body.date),
      entryType: body.entryType || EntryType.MANUAL,
      entryBy: body.name, // Using name as entryBy
      status: "PENDING", // Default status
      // Add moneyFor if not provided
      moneyFor: body.moneyFor || "OTHER",
      // Ensure email and phone are present
      email: body.email || "",
      phone: body.phone || "",
    };

    const transaction = await prisma.transaction.create({
      data,
      include: {
        User: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
        Organization: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Transaction creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const skip = (page - 1) * limit;

    let where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { transactionId: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const total = await prisma.transaction.count({ where });

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: limit,
      include: {
        User: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
        Organization: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + transactions.length < total,
      },
    });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}