// components/Admin/a_Dashboard/TransactionOverview.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  IndianRupee, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  Wallet
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoneyForCategory, TransactionType, TransactionNature, TransactionStatus } from '@prisma/client';

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

interface ApiResponse {
  transactions: Array<{
    id: string;
    amount: number;
    type: TransactionType;
    transactionNature: TransactionNature;
    status: TransactionStatus;
    moneyFor: MoneyForCategory;
    date: string;
  }>;
  stats: TransactionStats;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TransactionOverview = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/transactions');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { stats } = data || {
    stats: {
      totalAmount: 0,
      pendingAmount: 0,
      verifiedAmount: 0,
      creditAmount: 0,
      debitAmount: 0,
      categoryCounts: {},
      categoryAmounts: {},
      transactionTypeStats: {},
      monthlyTotals: []
    }
  };

  const filterDataByTime = (data: any[]) => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return data.filter(item => new Date(item.month) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1);
        return data.filter(item => new Date(item.month) >= monthAgo);
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth());
        return data.filter(item => new Date(item.month) >= yearAgo);
      default:
        return data;
    }
  };

  const pieChartData = Object.entries(stats.categoryAmounts).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Financial Overview</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive transaction analysis
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Balance</p>
                <p className="text-2xl font-bold text-green-700">
                  ₹{(stats.creditAmount - stats.debitAmount).toLocaleString()}
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Credit</p>
                <p className="text-2xl font-bold text-blue-700">
                  ₹{stats.creditAmount.toLocaleString()}
                </p>
              </div>
              <ArrowUpCircle className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total Debit</p>
                <p className="text-2xl font-bold text-red-700">
                  ₹{stats.debitAmount.toLocaleString()}
                </p>
              </div>
              <ArrowDownCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">
                  ₹{stats.pendingAmount.toLocaleString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Transaction Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filterDataByTime(stats.monthlyTotals)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('default', { month: 'short' })}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                />
                <Legend />
                <Line type="monotone" dataKey="credit" stroke="#82ca9d" name="Credit" />
                <Line type="monotone" dataKey="debit" stroke="#ff7875" name="Debit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Pie Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Methods Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(stats.transactionTypeStats).map(([type, count]) => ({
                  type,
                  count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {Object.entries(stats.transactionTypeStats).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.transactionNature === 'CREDIT' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.moneyFor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${
                        transaction.transactionNature === 'CREDIT'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        ₹{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'VERIFIED'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert for Pending Transactions */}
        {stats.pendingAmount > 0 && (
          <div className="flex items-center p-4 bg-yellow-50 rounded-lg mt-4">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <div>
              <span className="text-sm text-yellow-700">
                ₹{stats.pendingAmount.toLocaleString()} in transactions pending verification
              </span>
              <span className="text-xs text-yellow-600 block mt-1">
                Please review and verify these transactions
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionOverview;