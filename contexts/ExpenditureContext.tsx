// contexts/ExpenditureContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Define the shape of an expenditure item
export interface Expenditure {
  id: string;
  amount: number;
  date: Date | string;
  description?: string;
  category: "CYCLE" | "ASHRAM" | "STUDENT" | "OTHER";
  customCategory?: string;
  entryBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId?: string;
  User?: {
    fullname?: string;
    email: string;
  };
}

// Define the context value shape
interface ExpenditureContextType {
  expenditures: Expenditure[];
  loading: boolean;
  error: string | null;
  fetchExpenditures: (filters?: Record<string, string>) => Promise<void>;
  addExpenditure: (expenditure: Omit<Expenditure, "id" | "createdAt" | "updatedAt" | "entryBy">) => Promise<Expenditure | null>;
  updateExpenditure: (id: string, expenditure: Partial<Expenditure>) => Promise<Expenditure | null>;
  deleteExpenditure: (id: string) => Promise<boolean>;
  stats: {
    totalExpenditure: number;
    categoryBreakdown: Array<{ category: string; _sum: { amount: number } }>;
    monthlyBreakdown: Array<{ month: number; monthName: string; total: number }>;
    userContributions: Array<{ userId: string; total: number; user: { id: string; fullname: string; email: string } | null }>;
    dateRange: { startDate: string; endDate: string };
  } | null;
  fetchStats: (year?: string, month?: string) => Promise<void>;
  statsLoading: boolean;
}

// Create the context with a default value
const ExpenditureContext = createContext<ExpenditureContextType | undefined>(undefined);

// Provider component
export function ExpenditureProvider({ children }: { children: ReactNode }) {
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [stats, setStats] = useState<ExpenditureContextType["stats"] | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch all expenditures with optional filters
  const fetchExpenditures = useCallback(async (filters?: Record<string, string>) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = "/api/admin/expenditures";
      
      // Add query parameters if filters are provided
      if (filters && Object.keys(filters).length > 0) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        // If unauthorized, handle specifically
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }
        throw new Error(`Error fetching expenditures: ${response.statusText}`);
      }
      
      const data = await response.json();
      setExpenditures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error fetching expenditures:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  

  // Add a new expenditure
  const addExpenditure = useCallback(async (expenditure: Omit<Expenditure, "id" | "createdAt" | "updatedAt" | "entryBy">) => {
    setError(null);
    
    try {
      console.log("Sending expenditure data:", JSON.stringify(expenditure));
      
      const response = await fetch("/api/admin/expenditures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenditure),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Server error response:", responseData);
        throw new Error(responseData.error || `Error adding expenditure: ${response.statusText}`);
      }
      
      // Update the local state
      setExpenditures(prev => [responseData, ...prev]);
      
      return responseData;
    } catch (err) {
      console.error("Error details:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      return null;
    }
  }, []);
  
  // Update an existing expenditure
  const updateExpenditure = useCallback(async (id: string, expenditure: Partial<Expenditure>) => {
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/expenditures/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenditure),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error updating expenditure: ${response.statusText}`);
      }
      
      const updatedExpenditure = await response.json();
      
      // Update the local state
      setExpenditures(prev => 
        prev.map(item => item.id === id ? updatedExpenditure : item)
      );
      
      return updatedExpenditure;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error updating expenditure:", err);
      return null;
    }
  }, []);

  // Delete an expenditure
  const deleteExpenditure = useCallback(async (id: string) => {
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/expenditures/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error deleting expenditure: ${response.statusText}`);
      }
      
      // Update the local state by removing the deleted item
      setExpenditures(prev => prev.filter(item => item.id !== id));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error deleting expenditure:", err);
      return false;
    }
  }, []);

  // Fetch statistics data
  const fetchStats = useCallback(async (year?: string, month?: string) => {
    setStatsLoading(true);
    setError(null);
    
    try {
      let url = "/api/admin/expenditures/stats";
      
      // Add query parameters if year/month are provided
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (month) params.append("month", month);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        // If unauthorized, handle specifically
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }
        throw new Error(`Error fetching statistics: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error fetching statistics:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Create the context value
  const value = {
    expenditures,
    loading,
    error,
    fetchExpenditures,
    addExpenditure,
    updateExpenditure,
    deleteExpenditure,
    stats,
    fetchStats,
    statsLoading,
  };

  return <ExpenditureContext.Provider value={value}>{children}</ExpenditureContext.Provider>;
}

// Custom hook to use the expenditure context
export function useExpenditures() {
  const context = useContext(ExpenditureContext);
  if (context === undefined) {
    throw new Error("useExpenditures must be used within an ExpenditureProvider");
  }
  return context;
}