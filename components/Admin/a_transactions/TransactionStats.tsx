"use client"
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, ArrowUpRight, ArrowDownRight, AlertCircle, BarChart3 } from "lucide-react";

interface StatsData {
  totalAmount: number;
  totalTransactions: number;
  pendingCount: number;
  verifiedCount: number;
  creditAmount: number;
  debitAmount: number;
  creditTransactions: number;
  debitTransactions: number;
  rejectedCount: number;
  rejectedAmount: number;
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse rounded-xl bg-white shadow-md">
            <CardContent className="h-32 bg-gray-100" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
      {/* Balance Amount Card */}
      <Card className="rounded-xl bg-white shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Balance Amount</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <IndianRupee className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats?.totalAmount.toFixed(2) || "0.00"}
            </p>
            <p className="text-sm text-gray-500">
              {stats?.totalTransactions || 0} verified transactions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Credits Card */}
      <Card className="rounded-xl bg-white shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Credits</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats?.creditAmount.toFixed(2) || "0.00"}
            </p>
            <p className="text-sm text-gray-500">
              {stats?.creditTransactions || 0} credit transactions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Debits Card */}
      <Card className="rounded-xl bg-white shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Debits</h3>
            <div className="p-2 bg-red-50 rounded-lg">
              <ArrowDownRight className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats?.debitAmount.toFixed(2) || "0.00"}
            </p>
            <p className="text-sm text-gray-500">
              {stats?.debitTransactions || 0} debit transactions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rejected Card */}
      <Card className="rounded-xl bg-white shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Rejected Transactions</h3>
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats?.rejectedAmount.toFixed(2) || "0.00"}
            </p>
            <p className="text-sm text-gray-500">
              {stats?.rejectedCount || 0} rejected transactions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview Card */}
      <Card className="rounded-xl bg-white shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Status Overview</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Pending</span>
                <span className="text-lg font-semibold text-gray-900">{stats?.pendingCount || 0}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-sm text-gray-500">Verified</span>
                <span className="text-lg font-semibold text-gray-900">{stats?.verifiedCount || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}