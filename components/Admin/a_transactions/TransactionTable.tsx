"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/utils/format";
import { useTransactions } from "@/contexts/TransactionContext";
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { toast } from "sonner";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import debounce from "lodash/debounce";
import { DatePicker } from "@/components/ui/date-picker"; // Assuming you have a DatePicker component

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FilterOptions {
  status: TransactionStatus | "ALL";
  type: TransactionType | "ALL";
  dateRange: "today" | "week" | "month" | "all" | "custom";
  selectedDate: Date | null; // To store the selected specific date
}

export default function TransactionTable() {
  const {
    transactions,
    isLoading,
    pagination,
    setPagination,
    updateTransactionStatus,
    deleteTransaction,
    refetchTransactions,
  } = useTransactions();

  // States
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusAction, setStatusAction] = useState<"VERIFY" | "REJECT" | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on search
  };

  // Filter handlers
  const [filters, setFilters] = useState<FilterOptions>({
    status: "ALL",
    type: "ALL",
    dateRange: "all",
    selectedDate: null, // Initially no specific date selected
  });

  // Get date range based on selected filter
  const getDateRange = (range: string): { start: Date; end: Date } => {
    const end = new Date();
    const start = new Date();

    switch (range) {
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "week":
        start.setDate(start.getDate() - 7);
        break;
      case "month":
        start.setMonth(start.getMonth() - 1);
        break;
      case "custom":
        if (filters.selectedDate) {
          start.setDate(filters.selectedDate.getDate());
          start.setMonth(filters.selectedDate.getMonth());
          start.setFullYear(filters.selectedDate.getFullYear());
        }
        break;
      default:
        start.setFullYear(2000); // Set a past date for "all"
    }

    return { start, end };
  };

  // Apply all filters (search, status, type, date)
  const getFilteredTransactions = () => {
    return transactions.filter((transaction) => {
      // Search filter
      const searchMatch =
        searchTerm.length === 0 ||
        [
          transaction.name,
          transaction.email,
          transaction.transactionId,
          transaction.phone,
          transaction.amount.toString(),
        ].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const statusMatch =
        filters.status === "ALL" || transaction.status === filters.status;

      // Type filter
      const typeMatch =
        filters.type === "ALL" || transaction.type === filters.type;

      // Date filter
      const { start, end } = getDateRange(filters.dateRange);
      const transactionDate = new Date(transaction.date);
      const dateMatch = transactionDate >= start && transactionDate <= end;

      return searchMatch && statusMatch && typeMatch && dateMatch;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
    refetchTransactions();
  };

  // Status badge styling
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "VERIFIED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "";
    }
  };

  // Status update handler
  const handleStatusUpdate = async (status: TransactionStatus) => {
    if (!selectedTransaction) return;
    const success = await updateTransactionStatus(
      selectedTransaction.id,
      status
    );
    if (success) {
      toast.success(`Transaction ${status.toLowerCase()}`);
      setShowStatusDialog(false);
      setSelectedTransaction(null);
    } else {
      toast.error("Failed to update status");
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!selectedTransaction) return;
    const success = await deleteTransaction(selectedTransaction.id);
    if (success) {
      toast.success("Transaction deleted");
      setShowDeleteDialog(false);
      setSelectedTransaction(null);
    } else {
      toast.error("Failed to delete transaction");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Transactions</CardTitle>
        <CardDescription>
          Manage and monitor all transaction activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              {filters.status !== "ALL" && (
                <Badge variant="secondary" className="w-fit">
                  Status: {filters.status}
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="NET_BANKING">Net Banking</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                </SelectContent>
              </Select>
              {filters.type !== "ALL" && (
                <Badge variant="secondary" className="w-fit">
                  Type: {filters.type.replace("_", " ")}
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Select
                value={filters.dateRange}
                onValueChange={(value) =>
                  handleFilterChange("dateRange", value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
              {filters.dateRange !== "all" && (
                <Badge variant="secondary" className="w-fit">
                  Date:{" "}
                  {filters.dateRange.charAt(0).toUpperCase() +
                    filters.dateRange.slice(1)}
                </Badge>
              )}

              {filters.dateRange === "custom" && (
                <DatePicker
                  selectedDate={filters.selectedDate}
                  onDateChange={(date) =>
                    handleFilterChange("selectedDate", date)
                  }
                />
              )}
            </div>

            {(filters.status !== "ALL" ||
              filters.type !== "ALL" ||
              filters.dateRange !== "all" ||
              filters.selectedDate) && (
              <Button
                variant="outline"
                size="sm"
                className="h-10"
                onClick={() => {
                  setFilters({
                    status: "ALL",
                    type: "ALL",
                    dateRange: "all",
                    selectedDate: null,
                  });
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Nature</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.nature}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowStatusDialog(true);
                          }}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <div>
            Showing {pagination.page} of {pagination.totalPages} pages
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
