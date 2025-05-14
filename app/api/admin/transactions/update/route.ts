// app/api/admin/transactions/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { TransactionStatus, TransactionType, UserType, TransactionNature, MoneyForCategory, EntryType } from "@prisma/client";

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Received transaction update data:", data);
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

    // Handle userType properly - ensure it's an enum value
    let userTypeValue = UserType.INDIVIDUAL;
    if (data.userType === "organization" || data.userType === "ORGANIZATION") {
      userTypeValue = UserType.ORGANIZATION;
    }

    // Prepare the update data with proper type casting
    const updateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      userType: userTypeValue, // Use the enum value
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
      // User and organization relations
      userId: data.userId || null,
      // Don't include organizationId in update unless specifically provided
    };

    console.log("Updating transaction with data:", updateData);

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