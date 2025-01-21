// hooks/useTransactions.ts
import { useState } from 'react';
import { Transaction, TransactionStatus } from '@prisma/client';

interface TransactionFilters {
  search?: string;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`/api/admin/transactions?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setTransactions(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransactionStatus = async (
    id: string, 
    status: TransactionStatus,
    statusDescription?: string
  ) => {
    try {
      const response = await fetch(`/api/admin/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, statusDescription }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Refresh transactions
      await fetchTransactions();
      return true;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete transaction');

      // Refresh transactions
      await fetchTransactions();
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  };

  return {
    transactions,
    isLoading,
    pagination,
    filters,
    setFilters,
    setPagination,
    fetchTransactions,
    updateTransactionStatus,
    deleteTransaction,
  };
}