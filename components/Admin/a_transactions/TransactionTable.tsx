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
import { Transaction, TransactionStatus, TransactionType } from "@prisma/client";
import { toast } from "sonner";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FilterOptions {
  status: TransactionStatus | "ALL";
  type: TransactionType | "ALL";
  startDate: Date | undefined;
  endDate: Date | undefined;
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

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusAction, setStatusAction] = useState<"VERIFY" | "REJECT" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input with debounce
  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination((prev: Pagination) => ({ ...prev, page: 1 }));
  }, 300);

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    status: "ALL",
    type: "ALL",
    startDate: undefined,
    endDate: undefined,
  });

  // Handle filter changes
  const handleFilterChange = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination((prev: Pagination) => ({ ...prev, page: 1 }));
    refetchTransactions();
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = searchTerm.length === 0 || [
      transaction.name,
      transaction.email,
      transaction.transactionId,
      transaction.phone,
      transaction.amount.toString()
    ].some(field => 
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusMatch = filters.status === "ALL" || 
      transaction.status === filters.status;

    const typeMatch = filters.type === "ALL" || 
      transaction.type === filters.type;

    const transactionDate = new Date(transaction.date);
    const startDate = filters.startDate || new Date(2000, 0, 1);
    const endDate = filters.endDate || new Date();
    
    const dateMatch = transactionDate >= startDate && transactionDate <= endDate;

    return searchMatch && statusMatch && typeMatch && dateMatch;
  });

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
    const success = await updateTransactionStatus(selectedTransaction.id, status);
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
          <div className="flex w-full max-w-sm items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                onChange={handleSearch}
                className="w-full pl-9"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex flex-col gap-2">
              <Select
                value={filters.status}
                onValueChange={(value: TransactionStatus | "ALL") => handleFilterChange("status", value)}
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

            {/* Type Filter */}
            <div className="flex flex-col gap-2">
              <Select
                value={filters.type}
                onValueChange={(value: TransactionType | "ALL") => handleFilterChange("type", value)}
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

            {/* Date Range Filter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <Label className="text-sm text-muted-foreground mb-1">From</Label>
                  <DatePicker
                    selected={filters.startDate}
                    onSelect={(date) => handleFilterChange("startDate", date)}
                    className="w-[150px]"
                  />
                </div>
                <div className="flex flex-col">
                  <Label className="text-sm text-muted-foreground mb-1">To</Label>
                  <DatePicker
                    selected={filters.endDate}
                    onSelect={(date) => handleFilterChange("endDate", date)}
                    className="w-[150px]"
                  />
                </div>
              </div>
              {(filters.startDate || filters.endDate) && (
                <Badge variant="secondary" className="w-fit">
                  Date:{" "}
                  {filters.startDate?.toLocaleDateString() || "Start"} -{" "}
                  {filters.endDate?.toLocaleDateString() || "End"}
                </Badge>
              )}
            </div>

            {/* Clear Filters */}
            {(filters.status !== "ALL" || filters.type !== "ALL" || filters.startDate || filters.endDate) && (
              <Button
                variant="outline"
                size="sm"
                className="h-10 self-end"
                onClick={() => {
                  setFilters({
                    status: "ALL",
                    type: "ALL",
                    startDate: undefined,
                    endDate: undefined,
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
                <TableHead className="w-[120px]">
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
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-sm text-muted-foreground">Loading transactions...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-sm text-muted-foreground">No transactions found</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setFilters({
                            status: "ALL",
                            type: "ALL",
                            startDate: undefined,
                            endDate: undefined,
                          });
                          refetchTransactions();
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">{transaction.name}</TableCell>
                    <TableCell>{transaction.type.replace("_", " ")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.transactionNature === "CREDIT"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {transaction.transactionNature}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize", getStatusBadge(transaction.status))}>
                        {transaction.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>

                        {transaction.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setStatusAction("VERIFY");
                                setShowStatusDialog(true);
                              }}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Verify
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setStatusAction("REJECT");
                                setShowStatusDialog(true);
                              }}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
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
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {pagination.total} transactions
            {searchTerm && ` (Filtered from ${transactions.length} total)`}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev: Pagination) => ({
                  ...prev,
                  page: prev.page - 1,
                }))
              }
              disabled={pagination.page === 1 || isLoading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev: Pagination) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
              disabled={pagination.page === pagination.totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Modals */}
        <TransactionDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
        />

        {/* Status Update Dialog */}
        <Dialog
          open={showStatusDialog}
          onOpenChange={(open) => setShowStatusDialog(open)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {statusAction === "VERIFY" ? "Verify Transaction" : "Reject Transaction"}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to{" "}
                {statusAction === "VERIFY" ? "verify" : "reject"} this transaction?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancel
              </Button>
              <Button
                variant={statusAction === "VERIFY" ? "default" : "destructive"}
                onClick={() =>
                  handleStatusUpdate(
                    statusAction === "VERIFY" ? "VERIFIED" : "REJECTED"
                  )
                }
              >
                {statusAction === "VERIFY" ? "Verify" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={showDeleteDialog}
          onOpenChange={(open) => setShowDeleteDialog(open)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Transaction</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this transaction? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rest of the code remains the same... */}
      </CardContent>
    </Card>
  );
}