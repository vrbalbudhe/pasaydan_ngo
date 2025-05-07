// components/Admin/a_Expenditures/ExpenditureReports.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useExpenditures } from "@/contexts/ExpenditureContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, Calendar, FileText } from "lucide-react";
import ExpenditureChart from "./ExpenditureChart";
import MemberReport from "./MemberReport";
import MonthlyReport from "./MonthlyReport";
import YearlyReport from "./YearlyReport";
import { exportToPDF } from "@/utils/pdfExport";

export default function ExpenditureReports() {
  const { fetchStats, stats, statsLoading, error } = useExpenditures();
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("summary");
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Get available years (current year and 4 previous years)
  const years = Array.from({ length: 5 }, (_, i) => 
    (new Date().getFullYear() - i).toString()
  );

  // Month names for dropdown
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Fetch stats when filters change
  useEffect(() => {
    fetchStats(selectedYear, selectedMonth === "all" ? "" : selectedMonth);
  }, [fetchStats, selectedYear, selectedMonth]);

  // Apply filters
  const applyFilters = () => {
    fetchStats(selectedYear, selectedMonth === "all" ? "" : selectedMonth);
  };

  // Reset month filter
  const resetMonthFilter = () => {
    setSelectedMonth("all");
    fetchStats(selectedYear, "");
  };

  // Export report to PDF
  const exportReport = async () => {
    setIsExporting(true);
    
    try {
      if (!reportRef.current) {
        throw new Error("Report content not found");
      }
      
      // Create a filename
      const filename = `Expenditure_Report_${selectedYear}${selectedMonth !== "all" ? '_' + selectedMonth : ''}`;
      
      // Create a title
      const reportTitle = selectedMonth !== "all" 
        ? `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear} Expenditure Report`
        : `${selectedYear} Annual Expenditure Report`;
      
      // Export to PDF
      await exportToPDF(
        reportRef.current,
        filename,
        "Expenditure Report",
        reportTitle
      );
      
      toast({
        title: "Export Successful",
        description: `Report has been exported as ${filename}.pdf`,
      });
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Prepare chart data
  const getCategoryChartData = () => {
    if (!stats || !stats.categoryBreakdown) return [];
    
    return stats.categoryBreakdown.map(cat => ({
      name: cat.category === "OTHER" ? "Other" : 
            cat.category.charAt(0) + cat.category.slice(1).toLowerCase(),
      value: cat._sum.amount || 0
    }));
  };

  const getMonthlyChartData = () => {
    if (!stats || !stats.monthlyBreakdown) return [];
    
    return stats.monthlyBreakdown.map(month => ({
      name: month.monthName,
      value: month.total
    }));
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Reports</CardTitle>
          <CardDescription>
            Select time periods to analyze expenditure data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Year</label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger>
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
            
            <div>
              <label className="text-sm font-medium mb-1 block">Month (Optional)</label>
              <Select
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end space-x-2">
              <Button onClick={applyFilters} className="flex-grow">
                Apply Filters
              </Button>
              {selectedMonth !== "all" && (
                <Button variant="outline" onClick={resetMonthFilter}>
                  View All Months
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {statsLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !statsLoading && (
        <Card className="bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={applyFilters}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reports Content */}
      {!statsLoading && !error && stats && (
        <>
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline"
              onClick={exportReport}
              disabled={isExporting}
              className="space-x-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>Export Report</span>
            </Button>
          </div>

          <div ref={reportRef} className="space-y-6 bg-white p-4 rounded-lg">
            {/* Summary Statistics */}
            <Card className="print-break-inside-avoid">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                  <CardTitle>Expenditure Summary</CardTitle>
                </div>
                <CardDescription>
                  {selectedMonth !== "all" 
                    ? `Data for ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
                    : `Data for year ${selectedYear}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Expenditure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₹{stats.totalExpenditure?.toLocaleString('en-IN') || '0'}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.categoryBreakdown?.length || 0}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Members Contributing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.userContributions?.length || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Chart Visualizations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExpenditureChart 
                type="pie"
                data={getCategoryChartData()}
                title="Expenditure by Category"
                colors={["#4f46e5", "#ec4899", "#f59e0b", "#10b981"]}
              />
              
              {selectedMonth === "all" && (
                <ExpenditureChart 
                  type="bar"
                  data={getMonthlyChartData()}
                  title="Monthly Expenditure Breakdown"
                  colors={["#8884d8"]}
                />
              )}
            </div>

            {/* Detailed Reports Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 print-break-before">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="member">Member-wise</TabsTrigger>
                <TabsTrigger value="monthly">Month-wise</TabsTrigger>
                <TabsTrigger value="yearly">Year-wise</TabsTrigger>
              </TabsList>
              
              <TabsContent value="member" className="mt-4">
                <MemberReport data={stats.userContributions || []} />
              </TabsContent>
              
              <TabsContent value="monthly" className="mt-4">
                <MonthlyReport data={stats.monthlyBreakdown || []} year={selectedYear} />
              </TabsContent>
              
              <TabsContent value="yearly" className="mt-4">
                <YearlyReport currentYear={selectedYear} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}