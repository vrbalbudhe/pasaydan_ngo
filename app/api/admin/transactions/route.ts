// app/api/admin/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { TransactionType, EntryType, UserType, TransactionNature, TransactionStatus, MoneyForCategory } from "@prisma/client";
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
    // Check if request is FormData or JSON
    let data: any;
    let screenshot: File | null = null;
    let screenshotPath: string | undefined;

    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData
      const formData = await req.formData();
      data = Object.fromEntries(formData.entries());
      screenshot = formData.get("screenshot") as File | null;
      
      // Process screenshot if present
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
          
          const filepath = path.join(transactionDir, filename);
          await writeFile(filepath, buffer);
          screenshotPath = `/transactions/${filename}`;
        } catch (error) {
          console.error("Error saving screenshot:", error);
        }
      }
    } else {
      // Handle JSON
      data = await req.json();
    }

    console.log("Transaction POST data:", data);
    
    // Convert userType to proper enum
    let userTypeValue: UserType;
    if (typeof data.userType === 'string' && 
        (data.userType.toUpperCase() === 'ORGANIZATION' || data.userType === UserType.ORGANIZATION)) {
      userTypeValue = UserType.ORGANIZATION;
    } else {
      userTypeValue = UserType.INDIVIDUAL;
    }

    // Convert transactionNature to proper enum
    let transactionNatureValue: TransactionNature;
    if (typeof data.transactionNature === 'string' && 
        (data.transactionNature.toUpperCase() === 'DEBIT' || data.transactionNature === TransactionNature.DEBIT)) {
      transactionNatureValue = TransactionNature.DEBIT;
    } else {
      transactionNatureValue = TransactionNature.CREDIT;
    }

    // Convert transaction type to proper enum
    let transactionTypeValue: TransactionType;
    switch(data.type) {
      case 'UPI':
      case TransactionType.UPI:
        transactionTypeValue = TransactionType.UPI;
        break;
      case 'NET_BANKING':
      case TransactionType.NET_BANKING:
        transactionTypeValue = TransactionType.NET_BANKING;
        break;
      case 'CARD':
      case TransactionType.CARD:
        transactionTypeValue = TransactionType.CARD;
        break;
      default:
        transactionTypeValue = TransactionType.CASH;
    }

    // Convert moneyFor to proper enum
    let moneyForValue: MoneyForCategory;
    switch(data.moneyFor) {
      case 'CLOTHES':
      case MoneyForCategory.CLOTHES:
        moneyForValue = MoneyForCategory.CLOTHES;
        break;
      case 'FOOD':
      case MoneyForCategory.FOOD:
        moneyForValue = MoneyForCategory.FOOD;
        break;
      case 'CYCLE':
      case MoneyForCategory.CYCLE:
        moneyForValue = MoneyForCategory.CYCLE;
        break;
      case 'EDUCATION':
      case MoneyForCategory.EDUCATION:
        moneyForValue = MoneyForCategory.EDUCATION;
        break;
      case 'HEALTHCARE':
      case MoneyForCategory.HEALTHCARE:
        moneyForValue = MoneyForCategory.HEALTHCARE;
        break;
      default:
        moneyForValue = MoneyForCategory.OTHER;
    }

    // Convert entryType to proper enum
    const entryTypeValue = data.entryType === EntryType.DONATION_FORM ? 
      EntryType.DONATION_FORM : EntryType.MANUAL;

    // Convert status to proper enum
    let statusValue: TransactionStatus;
    switch(data.status) {
      case 'VERIFIED':
      case TransactionStatus.VERIFIED:
        statusValue = TransactionStatus.VERIFIED;
        break;
      case 'REJECTED':
      case TransactionStatus.REJECTED:
        statusValue = TransactionStatus.REJECTED;
        break;
      default:
        statusValue = TransactionStatus.PENDING;
    }
    
    // Extract and prepare transaction data with TypeScript-friendly approach
    // First create the base transaction data
    const transactionData: any = {
      name: data.name as string,
      email: data.email as string,
      phone: data.phone as string,
      amount: parseFloat(data.amount?.toString() || "0"),
      type: transactionTypeValue,
      transactionNature: transactionNatureValue,
      userType: userTypeValue,
      date: new Date(data.date as string),
      transactionId:
        data.type === TransactionType.CASH || data.type === "CASH"
          ? nanoid(10).toUpperCase()
          : (data.transactionId as string),
      screenshotPath,
      entryType: entryTypeValue,
      entryBy: data.entryBy as string,
      description: (data.description as string) || null,
      status: statusValue,
      moneyFor: moneyForValue,
      customMoneyFor:
        data.moneyFor === MoneyForCategory.OTHER ? (data.customMoneyFor as string) : null,
    };

    // If userId is provided and valid, include it
    if (data.userId && data.userId !== "manual-entry") {
      transactionData.userId = data.userId;
    }

    console.log("Creating transaction with:", transactionData);
    
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
    return createResponse(false, null, error instanceof Error ? error.message : "Failed to create transaction");
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