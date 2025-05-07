// components/Admin/a_Expenditures/MonthlyReport.tsx
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useExpenditures } from "@/contexts/ExpenditureContext";

interface MonthlyReportProps {
  data: Array<{
    month: number;
    monthName: string;
    total: number;
  }>;
  year: string;
}

export default function MonthlyReport({ data, year }: MonthlyReportProps) {
  const { fetchStats } = useExpenditures();
  const [selectedYear, setSelectedYear] = useState<string>(year);
  const [monthlyData, setMonthlyData] = useState(data);
  const [categoryData, setCategoryData] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(false);
  
  // Get available years (current year and 4 previous years)
  const years = Array.from({ length: 10 }, (_, i) => 
    (new Date().getFullYear() - i).toString()
  );

  // Fetch data when year changes
  useEffect(() => {
    const fetchYearData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/expenditures/stats?year=${selectedYear}`);
        
        if (response.ok) {
          const data = await response.json();
          setMonthlyData(data.monthlyBreakdown || []);
        } else {
          console.error("Error fetching monthly data for year:", selectedYear);
          setMonthlyData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMonthlyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchYearData();
  }, [selectedYear]);
  
  // Calculate highest monthly expenditure for progress bar scaling
  const maxMonthlyTotal = Math.max(...monthlyData.map((month) => month.total), 1);
  
  // Fetch category breakdown for each month
  useEffect(() => {
    async function fetchMonthlyCategories() {
      const result: Record<string, number[]> = {
        "CYCLE": Array(12).fill(0),
        "ASHRAM": Array(12).fill(0),
        "STUDENT": Array(12).fill(0),
        "OTHER": Array(12).fill(0),
      };
      
      setLoading(true);
      
      // Fetch data for each month separately
      for (let month = 1; month <= 12; month++) {
        try {
          const response = await fetch(`/api/admin/expenditures/stats?year=${selectedYear}&month=${month}`);
          if (response.ok) {
            const monthData = await response.json();
            
            if (monthData.categoryBreakdown) {
              monthData.categoryBreakdown.forEach((cat: any) => {
                if (result[cat.category]) {
                  result[cat.category][month - 1] = cat._sum.amount || 0;
                }
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching data for month ${month}:`, error);
        }
      }
      
      setCategoryData(result);
      setLoading(false);
    }
    
    if (monthlyData.length > 0) {
      fetchMonthlyCategories();
    }
  }, [monthlyData, selectedYear]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>Month-wise Expenditure Report</CardTitle>
            <CardDescription>
              Monthly breakdown of expenditures across all categories
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">Select Year:</label>
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : monthlyData.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No monthly data available for {selectedYear}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="hidden md:table-cell">Cycle</TableHead>
                <TableHead className="hidden md:table-cell">Ashram</TableHead>
                <TableHead className="hidden md:table-cell">Student</TableHead>
                <TableHead className="hidden md:table-cell">Other</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="hidden md:table-cell">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((month) => (
                <TableRow key={month.month}>
                  <TableCell className="font-medium">
                    {month.monthName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ₹{categoryData["CYCLE"]?.[month.month - 1]?.toLocaleString('en-IN') || '0'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ₹{categoryData["ASHRAM"]?.[month.month - 1]?.toLocaleString('en-IN') || '0'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ₹{categoryData["STUDENT"]?.[month.month - 1]?.toLocaleString('en-IN') || '0'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ₹{categoryData["OTHER"]?.[month.month - 1]?.toLocaleString('en-IN') || '0'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{month.total.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell w-[200px]">
                    <Progress 
                      value={(month.total / maxMonthlyTotal) * 100} 
                      className="h-2" 
                    />
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Yearly total row */}
              <TableRow className="bg-muted/50">
                <TableCell className="font-medium">
                  Yearly Total
                </TableCell>
                <TableCell className="hidden md:table-cell font-medium">
                  ₹{Object.values(categoryData["CYCLE"] || []).reduce((sum, val) => sum + val, 0).toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="hidden md:table-cell font-medium">
                  ₹{Object.values(categoryData["ASHRAM"] || []).reduce((sum, val) => sum + val, 0).toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="hidden md:table-cell font-medium">
                  ₹{Object.values(categoryData["STUDENT"] || []).reduce((sum, val) => sum + val, 0).toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="hidden md:table-cell font-medium">
                  ₹{Object.values(categoryData["OTHER"] || []).reduce((sum, val) => sum + val, 0).toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="text-right font-bold">
                  ₹{monthlyData.reduce((sum, month) => sum + month.total, 0).toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="hidden md:table-cell"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}