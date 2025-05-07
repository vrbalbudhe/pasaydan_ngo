// app/api/admin/expenditures/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET: Fetch all expenditures with optional filters
export async function GET(req: NextRequest) {
  try {
    // Parse URL for query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const userId = searchParams.get("userId");

    // Build filter object based on provided parameters
    let filter: any = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (startDate && endDate) {
      filter.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.date = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.date = {
        lte: new Date(endDate),
      };
    }
    
    if (userId) {
      filter.userId = userId;
    }

    // Fetch expenditures with filters
    const expenditures = await prisma.expenditure.findMany({
      where: filter,
      include: {
        User: {
          select: {
            fullname: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(expenditures);
  } catch (error) {
    console.error("Error fetching expenditures:", error);
    return NextResponse.json({ error: "Failed to fetch expenditures" }, { status: 500 });
  }
}

// POST: Create a new expenditure
// app/api/admin/expenditures/route.ts - POST function
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    console.log("Received expenditure data:", body);
    
    const { amount, date, description, category, customCategory, userId } = body;

    // Validate required fields
    if (!amount || !date || !category) {
      return NextResponse.json(
        { error: "Amount, date and category are required" },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Get a valid admin ID from the database to use as entryBy
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      return NextResponse.json(
        { error: "No admin found to associate with this expenditure" },
        { status: 500 }
      );
    }

    // Create new expenditure with valid admin ID
    const expenditure = await prisma.expenditure.create({
      data: {
        amount: parseFloat(amount.toString()),
        date: new Date(date),
        description: description || "",
        category,
        customCategory: category === "OTHER" ? (customCategory || "") : "",
        entryBy: admin.id, // Use a valid admin ID from the database
        userId: userId === "none" ? null : userId,
      },
    });

    return NextResponse.json(expenditure, { status: 201 });
  } catch (error) {
    console.error("Server error creating expenditure:", error);
    
    // More specific error message
    let errorMessage = "Failed to create expenditure";
    let errorDetails = "";
    
    if (error instanceof Error) {
      errorDetails = error.message;
    }
    
    return NextResponse.json({ 
      error: errorMessage, 
      details: errorDetails 
    }, { status: 500 });
  }
}