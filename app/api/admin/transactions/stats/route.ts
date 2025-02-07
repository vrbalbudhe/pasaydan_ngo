import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { TransactionStatus, TransactionNature } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Count only verified transactions for the balance card.
    const totalVerifiedTransactions = await prisma.transaction.count({
      where: { status: TransactionStatus.VERIFIED }
    });

    // Aggregate verified credit transactions.
    const verifiedCredit = await prisma.transaction.aggregate({
      where: {
        transactionNature: TransactionNature.CREDIT,
        status: TransactionStatus.VERIFIED
      },
      _count: true,
      _sum: { amount: true }
    });

    // Aggregate verified debit transactions.
    const verifiedDebit = await prisma.transaction.aggregate({
      where: {
        transactionNature: TransactionNature.DEBIT,
        status: TransactionStatus.VERIFIED
      },
      _count: true,
      _sum: { amount: true }
    });

    // Compute balance from verified transactions.
    const totalAmount = (verifiedCredit._sum.amount || 0) - (verifiedDebit._sum.amount || 0);

    // Count pending, verified, and rejected transactions (overall).
    const pendingCount = await prisma.transaction.count({
      where: { status: TransactionStatus.PENDING }
    });
    const verifiedCount = await prisma.transaction.count({
      where: { status: TransactionStatus.VERIFIED }
    });
    const rejectedCount = await prisma.transaction.count({
      where: { status: TransactionStatus.REJECTED }
    });

    // Aggregate rejected transactions.
    const rejectedAgg = await prisma.transaction.aggregate({
      where: { status: TransactionStatus.REJECTED },
      _count: true,
      _sum: { amount: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalAmount, // Balance from verified transactions only
        totalTransactions: totalVerifiedTransactions,
        creditAmount: verifiedCredit._sum.amount || 0,
        debitAmount: verifiedDebit._sum.amount || 0,
        creditTransactions: verifiedCredit._count,
        debitTransactions: verifiedDebit._count,
        pendingCount,
        verifiedCount,
        rejectedCount,
        rejectedAmount: rejectedAgg._sum.amount || 0,
      },
    });
  } catch (error: any) {
    console.error("Error fetching transaction stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transaction stats" },
      { status: 500 }
    );
  }
}
