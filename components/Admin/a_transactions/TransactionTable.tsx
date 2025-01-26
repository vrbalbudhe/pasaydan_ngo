"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/format";
import { useTransactions } from "@/contexts/TransactionContext";
import { Transaction, TransactionStatus } from "@prisma/client";
import { toast } from "sonner";
import { TransactionDetailsModal } from "./TransactionDetailsModal";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function TransactionTable() {
  const {
    transactions,
    isLoading,
    pagination,
    setPagination,
    updateTransactionStatus,
    deleteTransaction,
  } = useTransactions();

  // Modals
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [statusAction, setStatusAction] = useState<"VERIFY" | "REJECT" | null>(null);

  // Update status
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

  // Delete
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

  // Status badge styling
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "VERIFIED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  // Close details
  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
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
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.name}</TableCell>
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
                    <Badge className={getStatusBadge(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>

                  {/* ACTIONS CELL */}
                  <TableCell className="text-right">
                    {/* Inline Buttons Instead of Dropdown */}
                    <div className="flex items-center justify-end gap-2">
                      {/* View */}
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

                      {/* Verify / Reject if Pending */}
                      {transaction.status === "PENDING" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
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
                            className="text-red-600"
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

                      {/* Delete */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
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
      <div className="flex items-center justify-end space-x-2">
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

      {/* Details Modal */}
      <TransactionDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseModal}
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
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
