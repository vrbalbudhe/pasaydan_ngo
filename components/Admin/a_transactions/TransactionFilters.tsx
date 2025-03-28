"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionStatus } from "@prisma/client";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { useTransactions } from "@/contexts/TransactionContext";

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function TransactionFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  /**
   * Instead of `TransactionStatus | ""`, let's store `TransactionStatus | "ALL"`.
   * "ALL" means "no specific status filter".
   */
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "ALL">(
    "ALL"
  );

  const { setPagination } = useTransactions();

  const handleApplyFilters = () => {
    // Reset page to 1
    setPagination((prev: PaginationState) => ({
      ...prev,
      page: 1,
      dateRange, // Add the dateRange filter here
      statusFilter, // Include the status filter in the pagination state
      searchTerm, // If necessary, include searchTerm
    }));
    setIsOpen(false);
  };

  const handleReset = () => {
    setDateRange(null);
    setSearchTerm("");
    // Reset to "ALL"
    setStatusFilter("ALL");
    setPagination((prev: PaginationState) => ({ ...prev, page: 1 }));
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Search Field */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Search</h4>
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Status</h4>
            <Select
              value={statusFilter}
              onValueChange={(val) =>
                setStatusFilter(val as TransactionStatus | "ALL")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {Object.values(TransactionStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Date Range</h4>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange?.from || undefined,
                    to: dateRange?.to || undefined,
                  }}
                  onSelect={(range: any) => setDateRange(range)}
                  numberOfMonths={2}
                />
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Reset
            </Button>
            <Button size="sm" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
