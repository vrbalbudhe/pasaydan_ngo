// app/api/admin/dashboard/transactions/route.ts
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { MoneyForCategory, TransactionType, TransactionNature, TransactionStatus } from "@prisma/client";

interface TransactionStats {
  totalAmount: number;
  pendingAmount: number;
  verifiedAmount: number;
  creditAmount: number;
  debitAmount: number;
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
    const transactions = await prisma.transaction.findMany({
      include: {
        User: true,
        Organization: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Calculate monthly totals
    const monthlyData = transactions.reduce((acc, t) => {
      const monthYear = t.date.toISOString().slice(0, 7);
      if (!acc[monthYear]) {
        acc[monthYear] = { credit: 0, debit: 0 };
      }
      if (t.transactionNature === 'CREDIT') {
        acc[monthYear].credit += t.amount;
      } else {
        acc[monthYear].debit += t.amount;
      }
      return acc;
    }, {} as Record<string, { credit: number; debit: number }>);

    const monthlyTotals = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        credit: data.credit,
        debit: data.debit
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const stats: TransactionStats = {
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      pendingAmount: transactions
        .filter(t => t.status === 'PENDING')
        .reduce((sum, t) => sum + t.amount, 0),
      verifiedAmount: transactions
        .filter(t => t.status === 'VERIFIED')
        .reduce((sum, t) => sum + t.amount, 0),
      creditAmount: transactions
        .filter(t => t.transactionNature === 'CREDIT')
        .reduce((sum, t) => sum + t.amount, 0),
      debitAmount: transactions
        .filter(t => t.transactionNature === 'DEBIT')
        .reduce((sum, t) => sum + t.amount, 0),
      categoryCounts: transactions.reduce((acc, t) => ({
        ...acc,
        [t.moneyFor]: (acc[t.moneyFor] || 0) + 1
      }), {} as Record<MoneyForCategory, number>),
      categoryAmounts: transactions.reduce((acc, t) => ({
        ...acc,
        [t.moneyFor]: (acc[t.moneyFor] || 0) + t.amount
      }), {} as Record<MoneyForCategory, number>),
      transactionTypeStats: transactions.reduce((acc, t) => ({
        ...acc,
        [t.type]: (acc[t.type] || 0) + 1
      }), {} as Record<TransactionType, number>),
      monthlyTotals
    };

    return NextResponse.json({ transactions, stats }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching transaction data" },
      { status: 500 }
    );
  }
}