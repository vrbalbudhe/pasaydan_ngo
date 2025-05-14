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

    // Convert entryType to proper enum
    const entryTypeValue = data.entryType === EntryType.DONATION_FORM ? 
      EntryType.DONATION_FORM : EntryType.MANUAL;

    // Prepare the update data with proper type casting
    // Use any type to allow dynamic property assignment
    const updateData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      userType: userTypeValue,
      amount: parseFloat(data.amount.toString()),
      type: transactionTypeValue,
      transactionId: data.transactionId,
      transactionNature: transactionNatureValue,
      entryType: entryTypeValue,
      entryBy: data.entryBy,
      description: data.description || null,
      status: statusValue,
      statusDescription: data.statusDescription || null,
      moneyFor: moneyForValue,
      customMoneyFor: data.moneyFor === MoneyForCategory.OTHER ? data.customMoneyFor : null,
      date: new Date(data.date),
      verifiedBy: data.verifiedBy || null,
      verifiedAt: data.verifiedAt ? new Date(data.verifiedAt) : null,
    };

    // Only include userId if it's valid
    if (data.userId && data.userId !== "manual-entry") {
      updateData.userId = data.userId;
    } else {
      // If no valid userId, make sure to disconnect any existing user relation
      updateData.userId = null;
    }

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