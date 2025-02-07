// app/api/admin/dashboard/transactions/route.ts
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  MoneyForCategory,
  TransactionType,
  TransactionNature,
  TransactionStatus,
} from "@prisma/client";

interface TransactionStats {
  totalAmount: number; // verified total amount (balance)
  pendingAmount: number;
  verifiedAmount: number; // same as totalAmount here
  creditAmount: number;  // verified credit total
  debitAmount: number;   // verified debit total
  categoryCounts: Record<MoneyForCategory, number>;
  categoryAmounts: Record<MoneyForCategory, number>;
  transactionTypeStats: Record<TransactionType, number>;
  monthlyTotals: Array<{
    month: string;
    credit: number;
    debit: number;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all transactions with related User/Organization and order them by date
    const transactions = await prisma.transaction.findMany({
      include: {
        User: true,
        Organization: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Filter out only verified transactions for totals and breakdowns
    const verifiedTransactions = transactions.filter(
      (t) => t.status === TransactionStatus.VERIFIED
    );

    // Total balance (only verified)
    const totalAmount = verifiedTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    // For clarity, verifiedAmount is the same as totalAmount
    const verifiedAmount = totalAmount;

    // Verified credits and debits only
    const creditAmount = verifiedTransactions
      .filter((t) => t.transactionNature === TransactionNature.CREDIT)
      .reduce((sum, t) => sum + t.amount, 0);
    const debitAmount = verifiedTransactions
      .filter((t) => t.transactionNature === TransactionNature.DEBIT)
      .reduce((sum, t) => sum + t.amount, 0);

    // Pending amount computed from all transactions (if needed)
    const pendingAmount = transactions
      .filter((t) => t.status === TransactionStatus.PENDING)
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdowns from verified transactions only
    const categoryCounts = verifiedTransactions.reduce((acc, t) => {
      acc[t.moneyFor] = (acc[t.moneyFor] || 0) + 1;
      return acc;
    }, {} as Record<MoneyForCategory, number>);

    const categoryAmounts = verifiedTransactions.reduce((acc, t) => {
      acc[t.moneyFor] = (acc[t.moneyFor] || 0) + t.amount;
      return acc;
    }, {} as Record<MoneyForCategory, number>);

    // Transaction type stats from verified transactions only
    const transactionTypeStats = verifiedTransactions.reduce(
      (acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1;
        return acc;
      },
      {} as Record<TransactionType, number>
    );

    // Calculate monthly totals (using verified transactions only)
    const monthlyData = verifiedTransactions.reduce(
      (acc, t) => {
        // Get month in YYYY-MM format
        const monthYear = t.date.toISOString().slice(0, 7);
        if (!acc[monthYear]) {
          acc[monthYear] = { credit: 0, debit: 0 };
        }
        if (t.transactionNature === TransactionNature.CREDIT) {
          acc[monthYear].credit += t.amount;
        } else if (t.transactionNature === TransactionNature.DEBIT) {
          acc[monthYear].debit += t.amount;
        }
        return acc;
      },
      {} as Record<string, { credit: number; debit: number }>
    );

    const monthlyTotals = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        credit: data.credit,
        debit: data.debit,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const stats: TransactionStats = {
      totalAmount,
      pendingAmount,
      verifiedAmount,
      creditAmount,
      debitAmount,
      categoryCounts,
      categoryAmounts,
      transactionTypeStats,
      monthlyTotals,
    };

    return NextResponse.json({ transactions, stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    return NextResponse.json(
      { error: "Error fetching transaction data" },
      { status: 500 }
    );
  }
}
