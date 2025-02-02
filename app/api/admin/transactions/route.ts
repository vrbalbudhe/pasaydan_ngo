// app/api/admin/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { TransactionType, EntryType } from "@prisma/client";
import { nanoid } from "nanoid";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Helper function to ensure consistent response structure
const createResponse = (
  success: boolean,
  data: any = null,
  error: string | null = null,
  pagination: any = null
) => {
  return NextResponse.json(
    {
      success,
      data,
      error,
      pagination: pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
        limit: 10,
      },
    },
    { status: success ? 200 : 500 }
  );
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const screenshot = formData.get("screenshot") as File | null;

    // Process screenshot if present
    let screenshotPath: string | undefined;
    if (screenshot) {
      try {
        const bytes = await screenshot.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uniqueId = nanoid(10);
        const filename = `${uniqueId}-${screenshot.name}`;
        const transactionDir = path.join(
          process.cwd(),
          "public",
          "transactions"
        );
        await mkdir(transactionDir, { recursive: true });

        const filepath = path.join(transactionDir, filename); // Use the defined directory path
        await writeFile(filepath, buffer);
        screenshotPath = `/transactions/${filename}`;
      } catch (error) {
        console.error("Error saving screenshot:", error);
      }
    }

    // Extract and prepare transaction data
    const data = Object.fromEntries(formData.entries());
    const transactionData = {
      name: data.name as string,
      email: data.email as string,
      phone: data.phone as string,
      amount: parseFloat(data.amount as string),
      type: data.type as TransactionType,
      transactionNature: data.transactionNature as string,
      userType: data.userType as string,
      date: new Date(data.date as string),
      transactionId:
        data.type === "CASH"
          ? nanoid(10).toUpperCase()
          : (data.transactionId as string),
      screenshotPath,
      entryType: EntryType.MANUAL,
      entryBy: data.entryBy as string,
      description: (data.description as string) || null,
      status: data.status || "PENDING",
      moneyFor: data.moneyFor as string,
      customMoneyFor:
        data.moneyFor === "OTHER" ? (data.customMoneyFor as string) : null,
    };

    const transaction = await prisma.transaction.create({
      data: transactionData,
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

    return createResponse(true, transaction);
  } catch (error) {
    console.error("Transaction creation error:", error);
    return createResponse(false, null, "Failed to create transaction");
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

    // Build where clause
    let where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { transactionId: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Execute queries in parallel
    const [total, transactions] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
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
      }),
    ]);

    return createResponse(true, transactions, null, {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return createResponse(false, [], "Failed to fetch transactions");
  }
}
