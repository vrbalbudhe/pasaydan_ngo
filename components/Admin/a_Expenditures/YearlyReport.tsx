// components/Admin/a_Expenditures/YearlyReport.tsx
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useExpenditures } from "@/contexts/ExpenditureContext";

interface YearlyReportProps {
  currentYear: string;
}

export default function YearlyReport({ currentYear }: YearlyReportProps) {
  const [startYear, setStartYear] = useState<string>((parseInt(currentYear) - 4).toString());
  const [endYear, setEndYear] = useState<string>(currentYear);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get available years (current year and 9 previous years for greater range)
  const years = Array.from({ length: 10 }, (_, i) => 
    (new Date().getFullYear() - i).toString()
  );

  // Fetch data for the range of years
  useEffect(() => {
    async function fetchYearRangeData() {
      setLoading(true);
      setError(null);
      
      try {
        const startYearNum = parseInt(startYear);
        const endYearNum = parseInt(endYear);
        
        if (startYearNum > endYearNum) {
          setError("Start year cannot be greater than end year");
          setLoading(false);
          return;
        }
        
        const yearsToFetch = Array.from(
          { length: endYearNum - startYearNum + 1 }, 
          (_, i) => (startYearNum + i).toString()
        );
        
        const results = [];
        
        // Fetch each year individually
        for (const year of yearsToFetch) {
          try {
            const response = await fetch(`/api/admin/expenditures/stats?year=${year}`);
            
            if (!response.ok) {
              console.warn(`Failed to fetch data for year ${year}: ${response.status}`);
              continue; // Skip this year but continue with others
            }
            
            const data = await response.json();
            
            // Process category breakdown
            const categoryValues = {
              CYCLE: 0,
              ASHRAM: 0,
              STUDENT: 0,
              OTHER: 0,
            };
            
            data.categoryBreakdown?.forEach((cat: any) => {
              if (categoryValues.hasOwnProperty(cat.category)) {
                categoryValues[cat.category as keyof typeof categoryValues] = cat._sum.amount || 0;
              }
            });
            
            results.push({
              year,
              totalExpenditure: data.totalExpenditure || 0,
              categoryBreakdown: categoryValues,
            });
          } catch (yearError) {
            console.error(`Error fetching data for year ${year}:`, yearError);
            // Skip this year but continue with others
          }
        }
        
        // Sort by year (most recent first)
        setYearlyData(results.sort((a, b) => parseInt(b.year) - parseInt(a.year)));
      } catch (error) {
        console.error("Error fetching yearly data:", error);
        setError("Failed to fetch yearly data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchYearRangeData();
  }, [startYear, endYear]);

  // Calculate max total for progress bars
  const maxYearlyTotal = Math.max(
    ...yearlyData.map((year) => year.totalExpenditure),
    1
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Year-wise Expenditure Report</CardTitle>
              <CardDescription>
                Annual breakdown of expenditures across multiple years
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium whitespace-nowrap">Start Year:</label>
                <Select
                  value={startYear}
                  onValueChange={setStartYear}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Start Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={`start-${year}`} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium whitespace-nowrap">End Year:</label>
                <Select
                  value={endYear}
                  onValueChange={setEndYear}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="End Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={`end-${year}`} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 bg-red-50 rounded-lg">
              <p className="text-red-500">{error}</p>
            </div>
          ) : yearlyData.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No yearly data available for the selected range</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="hidden md:table-cell">Cycle</TableHead>
                  <TableHead className="hidden md:table-cell">Ashram</TableHead>
                  <TableHead className="hidden md:table-cell">Student</TableHead>
                  <TableHead className="hidden md:table-cell">Other</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="hidden md:table-cell">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearlyData.map((year) => (
                  <TableRow key={year.year}>
                    <TableCell className="font-medium">
                      {year.year}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      ₹{year.categoryBreakdown.CYCLE.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      ₹{year.categoryBreakdown.ASHRAM.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      ₹{year.categoryBreakdown.STUDENT.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      ₹{year.categoryBreakdown.OTHER.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{year.totalExpenditure.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell w-[200px]">
                      <Progress 
                        value={(year.totalExpenditure / maxYearlyTotal) * 100} 
                        className="h-2" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Grand total row */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-medium">
                    Grand Total
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    ₹{yearlyData
                      .reduce((sum, year) => sum + year.categoryBreakdown.CYCLE, 0)
                      .toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    ₹{yearlyData
                      .reduce((sum, year) => sum + year.categoryBreakdown.ASHRAM, 0)
                      .toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    ₹{yearlyData
                      .reduce((sum, year) => sum + year.categoryBreakdown.STUDENT, 0)
                      .toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    ₹{yearlyData
                      .reduce((sum, year) => sum + year.categoryBreakdown.OTHER, 0)
                      .toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₹{yearlyData
                      .reduce((sum, year) => sum + year.totalExpenditure, 0)
                      .toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Category Distribution Card */}
      {!loading && !error && yearlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution Summary</CardTitle>
            <CardDescription>
              Total breakdown of expenditures by category for {startYear} to {endYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Total Amount by Category</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Cycle:</span> 
                    <span className="font-medium">
                      ₹{yearlyData.reduce((sum, year) => sum + year.categoryBreakdown.CYCLE, 0).toLocaleString('en-IN')}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Ashram:</span> 
                    <span className="font-medium">
                      ₹{yearlyData.reduce((sum, year) => sum + year.categoryBreakdown.ASHRAM, 0).toLocaleString('en-IN')}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Student:</span> 
                    <span className="font-medium">
                      ₹{yearlyData.reduce((sum, year) => sum + year.categoryBreakdown.STUDENT, 0).toLocaleString('en-IN')}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Other:</span> 
                    <span className="font-medium">
                      ₹{yearlyData.reduce((sum, year) => sum + year.categoryBreakdown.OTHER, 0).toLocaleString('en-IN')}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Percentage by Category</h3>
                <ul className="space-y-2">
                  {['CYCLE', 'ASHRAM', 'STUDENT', 'OTHER'].map(category => {
                    const totalAmount = yearlyData.reduce((sum, year) => 
                      sum + year.categoryBreakdown[category as keyof typeof year.categoryBreakdown], 0
                    );
                    const totalExpenditure = yearlyData.reduce((sum, year) => 
                      sum + year.totalExpenditure, 0
                    );
                    const percentage = totalExpenditure 
                      ? ((totalAmount / totalExpenditure) * 100).toFixed(1) 
                      : '0';
                    
                    return (
                      <li key={category} className="flex justify-between">
                        <span>{category.charAt(0) + category.slice(1).toLowerCase()}:</span>
                        <span className="font-medium">{percentage}%</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}