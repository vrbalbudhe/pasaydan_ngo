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

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

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
        setTransactions(data.data);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
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
      return true;
    } catch (error) {
      console.error("Error updating transaction status:", error);
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
      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
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
