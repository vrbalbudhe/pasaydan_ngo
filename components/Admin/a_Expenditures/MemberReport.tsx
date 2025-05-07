// components/Admin/a_Expenditures/MemberReport.tsx
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface MemberReportProps {
  data: Array<{
    userId: string;
    total: number;
    user: {
      id: string;
      fullname: string;
      email: string;
    } | null;
  }>;
}

export default function MemberReport({ data }: MemberReportProps) {
  // Year selection state
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [reportData, setReportData] = useState(data);
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
          setReportData(data.userContributions || []);
        } else {
          console.error("Error fetching member data for year:", selectedYear);
          setReportData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchYearData();
  }, [selectedYear]);

  // Sort data by total amount (highest first)
  const sortedData = [...reportData].sort((a, b) => b.total - a.total);
  
  // Calculate total contribution
  const totalContribution = reportData.reduce((sum, item) => sum + item.total, 0);
  
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Function to calculate percentage
  const calculatePercentage = (amount: number) => {
    if (totalContribution === 0) return 0;
    return ((amount / totalContribution) * 100).toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>Member-wise Contribution Report</CardTitle>
            <CardDescription>
              Detailed breakdown of expenditures by members
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
        ) : reportData.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No member contribution data available for {selectedYear}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Amount Contributed</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow key={item.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="" />
                        <AvatarFallback>
                          {item.user?.fullname ? getInitials(item.user.fullname) : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {item.user?.fullname || "Unknown Member"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.user?.email || "-"}</TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{item.total.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-medium">
                      {calculatePercentage(item.total)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Total row */}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={2} className="font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  ₹{totalContribution.toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="default" className="font-medium">
                    100%
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}