// app/api/admin/expenditures/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET: Fetch a specific expenditure by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch expenditure with related user info
    const expenditure = await prisma.expenditure.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            fullname: true,
            email: true,
          },
        },
      },
    });

    if (!expenditure) {
      return NextResponse.json({ error: "Expenditure not found" }, { status: 404 });
    }

    return NextResponse.json(expenditure);
  } catch (error) {
    console.error("Error fetching expenditure:", error);
    return NextResponse.json({ error: "Failed to fetch expenditure" }, { status: 500 });
  }
}

// PUT: Update an existing expenditure
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
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

    // Process userId for "none" value
    const processedUserId = userId === "none" ? null : userId;

    // Update expenditure
    const updatedExpenditure = await prisma.expenditure.update({
      where: { id },
      data: {
        amount: parseFloat(amount.toString()),
        date: new Date(date),
        description,
        category,
        customCategory: category === "OTHER" ? customCategory : "",
        userId: processedUserId,
      },
    });

    return NextResponse.json(updatedExpenditure);
  } catch (error) {
    console.error("Error updating expenditure:", error);
    return NextResponse.json({ error: "Failed to update expenditure" }, { status: 500 });
  }
}

// DELETE: Remove an expenditure
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete expenditure
    await prisma.expenditure.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Expenditure deleted successfully" });
  } catch (error) {
    console.error("Error deleting expenditure:", error);
    return NextResponse.json({ error: "Failed to delete expenditure" }, { status: 500 });
  }
}