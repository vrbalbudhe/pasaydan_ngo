import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DonationEntry } from "@/app/pasaydan/admin/calendar/page";

interface CalendarGridProps {
  calendarGrid: (number | null)[][];
  dayLabels: string[];
  getDayDonations: (day: number) => DonationEntry[];
  getDayTotal: (day: number) => number;
  openAddDialog: (day: number) => void;
  openEditDialog: (donation: DonationEntry) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarGrid,
  dayLabels,
  getDayDonations,
  getDayTotal,
  openAddDialog,
  openEditDialog
}) => {
  // Helper to get payment type icon
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "UPI": return "💸";
      case "CARD": return "💳";
      case "NET_BANKING": return "🏦";
      case "CASH":
      default: return "💰";
    }
  };

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    
    // Get the calendar's current month and year from the first day with donations
    const firstDayWithDonations = calendarGrid.flat().find(day => day !== null);
    if (!firstDayWithDonations) return false;
    
    const donations = getDayDonations(firstDayWithDonations);
    if (!donations.length) return false;
    
    const calendarDate = new Date(donations[0].date);
    
    return (
      day === currentDay && 
      calendarDate.getMonth() === currentMonth && 
      calendarDate.getFullYear() === currentYear
    );
  };

  return (
    <Card className="bg-white shadow-md overflow-hidden">
      <CardContent className="p-6">
        {/* Day labels */}
        <div className="grid grid-cols-7 mb-4 border-b pb-2">
          {dayLabels.map((day, index) => (
            <div key={index} className="text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarGrid.flat().map((day, index) => {
            if (day === null) {
              return <div key={index} className="bg-gray-50 h-32 rounded-lg" />;
            }

            const dayDonations = getDayDonations(day);
            const dayTotal = getDayTotal(day);
            const todayHighlight = isToday(day) ? "ring-2 ring-blue-400" : "";

            return (
              <div 
                key={index} 
                className={`border rounded-lg h-32 flex flex-col bg-white shadow-sm hover:shadow-md transition-all ${todayHighlight}`}
              >
                {/* Day header */}
                <div className="px-2 py-1 flex justify-between items-center border-b">
                  <span className={`font-semibold ${isToday(day) ? "text-blue-600" : "text-gray-700"}`}>
                    {day}
                  </span>
                  {dayDonations.length > 0 && (
                    <span className={`text-xs font-medium ${dayTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(dayTotal)}
                    </span>
                  )}
                </div>

                {/* Donations list */}
                <div className="flex-grow overflow-y-auto p-1 space-y-1">
                  {dayDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className={`
                        cursor-pointer 
                        px-2 py-1 
                        rounded-md 
                        text-xs 
                        ${
                          donation.transactionNature === "CREDIT"
                            ? "bg-green-50 hover:bg-green-100 text-green-800 border-l-2 border-green-500"
                            : "bg-red-50 hover:bg-red-100 text-red-800 border-l-2 border-red-500"
                        }
                      `}
                      onClick={() => openEditDialog(donation)}
                    >
                      <div className="font-medium truncate flex items-center">
                        <span className="mr-1">{getPaymentIcon(donation.type)}</span>
                        {donation.name || "Unknown User"}
                      </div>
                      <div className="text-[0.7rem] opacity-70 flex justify-between">
                        <span>{formatCurrency(donation.amount)}</span>
                        <span className="italic">
                          {donation.type?.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full border-t text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => openAddDialog(day)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarGrid;