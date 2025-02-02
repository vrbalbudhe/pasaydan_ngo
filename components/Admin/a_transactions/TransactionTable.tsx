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
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { toast } from "sonner";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import { DatePicker } from "@/components/ui/date-picker"; // Assuming you have a DatePicker component
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import TransactionUpdateForm from "./TransactionUpdateForm";

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
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedDates?: string[];
}

interface Transaction {
  id: string;
  name: string;
  email: string;
  phone: string;
  // userType: UserType;
  amount: number;
  type: TransactionType;
  transactionId: string;
  date: Date;
  // transactionNature: TransactionNature;
  screenshotPath?: string | null;
  // entryType: EntryType;
  entryBy: string;
  entryAt: Date;
  description?: string;
  status: TransactionStatus;
  statusDescription?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  // moneyFor: MoneyForCategory;
  customMoneyFor?: string;
  userId?: string;
  organizationId?: string | null;
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
  const [showEditForm, setShowEditForm] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showAcceptStatusDialog, setShowAcceptStatusDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [statusAction, setStatusAction] = useState<"VERIFY" | "REJECT" | null>(
    null
  );
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

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    try {
      const updatedTransactionData: Transaction = {
        ...updatedTransaction,
        screenshotPath: updatedTransaction.screenshotPath ?? null,
      };

      console.log("Sending Updated Transaction:", updatedTransactionData);

      const response = await fetch("/api/transactions/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransactionData),
      });

      if (!response.ok) {
        throw new Error(`Error updating transaction: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Transaction updated successfully!", responseData);
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Network error updating transaction:", error);
    }
  };

  const handleCancelUpdate = () => {
    setSelectedTransaction(null); // Close the form on cancel
  };
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    status: "ALL",
    type: "ALL",
    dateRange: "all",
    selectedDate: null,
    startDate: undefined,
    endDate: undefined,
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

  const handleShowScreenshot = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowScreenshot(true);
  };

  // Inside your TableRow
  <Button variant="ghost" onClick={() => handleShowScreenshot(transactions)}>
    <Eye className="h-5 w-5" />
  </Button>;

  // Screenshot section, conditionally rendered
  {
    showScreenshot && selectedTransaction?.screenshotPath && (
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Screenshot:</h3>
        <img
          src={selectedTransaction.screenshotPath}
          alt="Transaction Screenshot"
          className="mt-2 max-w-full h-auto rounded-lg border"
        />
      </div>
    );
  }

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
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      startDate: undefined, // Ensure these are included in the object
      endDate: undefined,
    }));
    setPagination((prev: any) => ({ ...prev, page: 1 }));
  };

  // Filter transactions
  const filteredTransactionsList = transactions.filter((transaction) => {
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

    return searchMatch;
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
      {showScreenshot && selectedTransaction?.screenshotPath && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="relative p-4 bg-white rounded-lg shadow-lg max-w-3xl w-full">
            <h3 className="text-xl font-semibold">Screenshot:</h3>
            {selectedTransaction?.screenshotPath ? (
              <img
                src={selectedTransaction.screenshotPath}
                alt="Transaction Screenshot"
                className="mt-2 max-w-full h-auto rounded-lg border"
              />
            ) : (
              <p>No Screenshots Available!</p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setShowScreenshot(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

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
                onValueChange={(value: TransactionStatus | "ALL") =>
                  handleFilterChange("status", value)
                }
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
                onValueChange={(value: TransactionType | "ALL") =>
                  handleFilterChange("type", value)
                }
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
                  <Label className="text-sm text-muted-foreground mb-1">
                    From
                  </Label>
                  <DatePicker
                    selected={filters.startDate}
                    onSelect={(date) => handleFilterChange("startDate", date)}
                    className="w-[150px]"
                  />
                </div>
                <div className="flex flex-col">
                  <Label className="text-sm text-muted-foreground mb-1">
                    To
                  </Label>
                  <DatePicker
                    selected={filters.endDate}
                    onSelect={(date) => handleFilterChange("endDate", date)}
                    className="w-[150px]"
                  />
                </div>
              </div>
              {(filters.startDate || filters.endDate) && (
                <Badge variant="secondary" className="w-fit">
                  Date: {filters.startDate?.toLocaleDateString() || "Start"} -{" "}
                  {filters.endDate?.toLocaleDateString() || "End"}
                </Badge>
              )}

              {filters.dateRange === "custom" && (
                <DatePicker
                  selected={filters.selectedDate} // Use selected instead of selectedDate
                  onSelect={
                    (date: Date | null) =>
                      handleFilterChange("selectedDate", date) // Adjust the handler function if needed
                  }
                />
              )}
            </div>

            {/* Clear Filters */}
            {(filters.status !== "ALL" ||
              filters.type !== "ALL" ||
              filters.startDate ||
              filters.endDate) && (
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
                    dateRange: undefined,
                    selectedDates: undefined,
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
                      <p className="text-sm text-muted-foreground">
                        Loading transactions...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        No transactions found
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm(""); // Reset search term
                          setFilters({
                            status: "ALL", // Reset status
                            type: "ALL", // Reset type
                            startDate: undefined, // Reset start date
                            endDate: undefined, // Reset end date
                            dateRange: "all", // Reset date range to "all"
                            selectedDate: null, // Reset selected date to null
                          });
                          refetchTransactions(); // Refetch transactions with the reset filters
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
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    {/* <TableCell>{transaction.nature}</TableCell> */}
                    <TableCell className="text-right">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "capitalize",
                          getStatusBadge(transaction.status)
                        )}
                      >
                        {transaction.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-2">
                        <div key={transaction.transactionId} className="mb-4">
                          <Button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowEditForm(true);
                            }}
                          >
                            Edit Transaction
                          </Button>
                        </div>
                        {showEditForm && (
                          <div className="fixed inset-0 bg-opacity-50 bg-slate-600 backdrop-blur-lg flex justify-center items-start pt-10 z-50">
                            <div className="bg-white overflow-auto p-8 rounded-lg w-full max-w-xl max-h-[90vh]">
                              <TransactionUpdateForm
                                transaction={
                                  selectedTransaction
                                    ? {
                                        ...selectedTransaction,
                                        screenshotPath:
                                          selectedTransaction.screenshotPath ??
                                          null,
                                      }
                                    : null
                                }
                                onUpdate={handleUpdateTransaction}
                                onCancel={handleCancelUpdate}
                              />
                            </div>
                          </div>
                        )}

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
                            setStatusAction("VERIFY"); // Set the action to "VERIFY"
                            setShowStatusDialog(true); // Show the dialog
                          }}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setStatusAction("REJECT"); // Set the action to "REJECT"
                            setShowStatusDialog(true); // Show the dialog
                          }}
                          className="text-slate-800"
                        >
                          X
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
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowScreenshot(true);
                          }}
                        >
                          <Eye className="h-5 w-5" />
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
            Showing {filteredTransactions.length} of {pagination.total}{" "}
            transactions
            {searchTerm && ` (Filtered from ${transactions.length} total)`}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev: any) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev: any) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page >= pagination.totalPages}
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
                {statusAction === "VERIFY"
                  ? "Verify Transaction"
                  : "Reject Transaction"}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to{" "}
                {statusAction === "VERIFY" ? "verify" : "reject"} this
                transaction?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowStatusDialog(false)}
              >
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
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
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
