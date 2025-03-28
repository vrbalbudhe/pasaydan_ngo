// contexts/TransactionContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Transaction, TransactionStatus } from "@prisma/client";
import { toast } from "sonner";

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  refetchTransactions: () => Promise<void>;
  updateTransactionStatus: (id: string, status: TransactionStatus) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  setPagination: (pagination: any) => void;
}

const defaultPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(defaultPagination);

  // Fetch logic
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/admin/transactions?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setTransactions(data.data || []);
        // Ensure pagination data exists before updating
        if (data.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: data.pagination.total || 0,
            totalPages: data.pagination.totalPages || 1,
          }));
        }
      } else {
        throw new Error(data.error || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
      // Reset to default state on error
      setTransactions([]);
      setPagination(defaultPagination);
    } finally {
      setIsLoading(false);
    }
  };

  // Update transaction status
  const updateTransactionStatus = async (id: string, status: TransactionStatus) => {
    try {
      const response = await fetch(`/api/admin/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      
      await fetchTransactions();
      toast.success("Transaction status updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating transaction status:", error);
      toast.error("Failed to update transaction status");
      return false;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete transaction");
      
      await fetchTransactions();
      toast.success("Transaction deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
      return false;
    }
  };

  // Automatically fetch on page change
  useEffect(() => {
    fetchTransactions();
  }, [pagination.page]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        pagination,
        refetchTransactions: fetchTransactions,
        updateTransactionStatus,
        deleteTransaction,
        setPagination,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
}