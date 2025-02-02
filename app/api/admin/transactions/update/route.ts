import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { TransactionStatus, TransactionType, UserType, TransactionNature, MoneyForCategory, EntryType } from "@prisma/client";

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // Check if the transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Prepare the update data with proper type casting
    const updateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      userType: data.userType as UserType,
      amount: parseFloat(data.amount.toString()),
      type: data.type as TransactionType,
      transactionId: data.transactionId,
      transactionNature: data.transactionNature as TransactionNature,
      entryType: data.entryType as EntryType,
      entryBy: data.entryBy,
      description: data.description || null,
      status: data.status as TransactionStatus,
      statusDescription: data.statusDescription || null,
      moneyFor: data.moneyFor as MoneyForCategory,
      customMoneyFor: data.moneyFor === "OTHER" ? data.customMoneyFor : null,
      date: new Date(data.date),
      verifiedBy: data.verifiedBy || null,
      verifiedAt: data.verifiedAt ? new Date(data.verifiedAt) : null,
      // Removed updatedAt as Prisma handles this automatically
    };

    // Update the transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
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
      data: updatedTransaction,
    });

  } catch (error: any) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update transaction",
        details: error.message,
      },
      { status: 500 }
    );
  }
}