// app/api/admin/transactions/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { TransactionStatus, TransactionNature } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Get total transactions
    const totalTransactions = await prisma.transaction.count();

    // Get transactions by nature with amounts
    const creditTransactions = await prisma.transaction.aggregate({
      where: {
        transactionNature: TransactionNature.CREDIT
      },
      _count: true,
      _sum: {
        amount: true
      }
    });

    const debitTransactions = await prisma.transaction.aggregate({
      where: {
        transactionNature: TransactionNature.DEBIT
      },
      _count: true,
      _sum: {
        amount: true
      }
    });

    // Get status counts
    const statusCounts = await prisma.transaction.groupBy({
      by: ['status'],
      _count: true,
    });

    const creditAmount = creditTransactions._sum.amount || 0;
    const debitAmount = debitTransactions._sum.amount || 0;
    const totalAmount = creditAmount - debitAmount;

    const pendingCount = statusCounts.find(s => s.status === TransactionStatus.PENDING)?._count || 0;
    const verifiedCount = statusCounts.find(s => s.status === TransactionStatus.VERIFIED)?._count || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalAmount,
        totalTransactions,
        creditAmount,
        debitAmount,
        creditTransactions: creditTransactions._count,
        debitTransactions: debitTransactions._count,
        pendingCount,
        verifiedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transaction stats" },
      { status: 500 }
    );
  }
}