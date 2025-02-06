"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface StatsData {
  totalAmount: number;
  totalTransactions: number;
  pendingCount: number;
  verifiedCount: number;
  creditAmount: number;
  debitAmount: number;
  creditTransactions: number;
  debitTransactions: number;
}

export function TransactionStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/transactions/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24 bg-gray-100" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Balance Amount Card */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-gray-600">Balance Amount</h3>
          <p className="text-2xl font-bold mt-2 text-blue-600">
            ₹{stats?.totalAmount.toFixed(2) || "0.00"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            From {stats?.totalTransactions || 0} transactions
          </p>
        </CardContent>
      </Card>

      {/* Credits Card */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-gray-600">Credits</h3>
          <p className="text-2xl font-bold mt-2 text-green-600">
            ₹{stats?.creditAmount.toFixed(2) || "0.00"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total credit transactions: {stats?.creditTransactions || 0}
          </p>
        </CardContent>
      </Card>

      {/* Debits Card */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-gray-600">Debits</h3>
          <p className="text-2xl font-bold mt-2 text-red-600">
            ₹{stats?.debitAmount.toFixed(2) || "0.00"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total debit transactions: {stats?.debitTransactions || 0}
          </p>
        </CardContent>
      </Card>

      {/* Status Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-gray-600">Status Overview</h3>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Pending</span>
              <span className="font-medium">{stats?.pendingCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Verified</span>
              <span className="font-medium">{stats?.verifiedCount || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
