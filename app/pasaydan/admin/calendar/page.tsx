// app/calendar/page.tsx
'use client'
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  date: string;
}

interface User {
  id: string;
  fullname: string;
  transactions: Transaction[];
}

interface CalendarData {
  [key: string]: {
    [date: string]: Transaction[];
  };
}

export default function CalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString('default', { month: 'long' })
  );
  const [selectedDialog, setSelectedDialog] = useState<{
    isOpen: boolean;
    date: string;
    userId: string;
    transactions: Transaction[];
  }>({
    isOpen: false,
    date: "",
    userId: "",
    transactions: [],
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (month: string) => {
    const date = new Date(`${month} 1, 2024`);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const [calendarData, setCalendarData] = useState<CalendarData>({});

  // Fetch calendar data when month changes
  const fetchCalendarData = async (month: string) => {
    try {
      const response = await fetch(`/api/calendar?month=${month}`);
      const data = await response.json();
      setCalendarData(data);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  // Update transaction
  const updateTransaction = async (
    transactionId: string,
    amount: number,
    type: "CREDIT" | "DEBIT"
  ) => {
    try {
      await fetch(`/api/transactions/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, type }),
      });
      // Refresh calendar data
      await fetchCalendarData(selectedMonth);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
          <div className="w-[200px]">
            <Select
              value={selectedMonth}
              onValueChange={(value) => {
                setSelectedMonth(value);
                fetchCalendarData(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                {Array.from({ length: getDaysInMonth(selectedMonth) }).map((_, i) => (
                  <TableHead key={i + 1} className="text-center">
                    {i + 1}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(calendarData).map(([userId, userData]) => (
                <TableRow key={userId}>
                  <TableCell className="font-medium">
                    {userData.name}
                  </TableCell>
                  {Array.from({ length: getDaysInMonth(selectedMonth) }).map((_, i) => {
                    const date = `${i + 1}`;
                    const transactions = userData[date] || [];
                    const totalAmount = transactions.reduce(
                      (sum, t) => sum + (t.type === "CREDIT" ? t.amount : -t.amount),
                      0
                    );

                    return (
                      <TableCell
                        key={date}
                        className="text-center cursor-pointer hover:bg-gray-100"
                        onClick={() =>
                          setSelectedDialog({
                            isOpen: true,
                            date,
                            userId,
                            transactions,
                          })
                        }
                      >
                        {totalAmount !== 0 && (
                          <span
                            className={
                              totalAmount > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            ₹{Math.abs(totalAmount)}
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={selectedDialog.isOpen}
        onOpenChange={(isOpen) =>
          setSelectedDialog((prev) => ({ ...prev, isOpen }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Transactions for {selectedDialog.date} {selectedMonth}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDialog.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center space-x-4 p-2 border rounded"
              >
                <Input
                  type="number"
                  value={transaction.amount}
                  onChange={(e) =>
                    updateTransaction(
                      transaction.id,
                      parseFloat(e.target.value),
                      transaction.type
                    )
                  }
                  className="w-32"
                />
                <Select
                  value={transaction.type}
                  onValueChange={(value: "CREDIT" | "DEBIT") =>
                    updateTransaction(
                      transaction.id,
                      transaction.amount,
                      value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREDIT">Credit</SelectItem>
                    <SelectItem value="DEBIT">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button
              onClick={() => setSelectedDialog((prev) => ({ ...prev, isOpen: false }))}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}