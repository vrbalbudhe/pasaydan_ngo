import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign } from "lucide-react";

interface DonationDayCellProps {
  day: number | null;
  currentMonth: number;
  currentYear: number;
  getDayDonations: (day: number) => any[];
  getDayTotal: (day: number) => number;
  getUserName: (userId: string) => string;
  openDonationEditor: (donationId: string, day: number) => void;
  openAddDonationDialog: (day: number) => void;
  setSelectedUser: (userId: string | null) => void;
}

const DonationDayCell: React.FC<DonationDayCellProps> = ({
  day,
  currentMonth,
  currentYear,
  getDayDonations,
  getDayTotal,
  getUserName,
  openDonationEditor,
  openAddDonationDialog,
  setSelectedUser,
}) => {
  if (day === null) {
    return <div className="bg-gray-50/50 h-36 rounded-lg border border-gray-100" />;
  }

  const dayDonations = getDayDonations(day) || [];
  const dayTotal = getDayTotal(day);

  return (
    <div className="border rounded-lg h-36 flex flex-col bg-white shadow-sm hover:shadow-md transition-all duration-200 ease-in-out">
      {/* Day Header */}
      <div className="px-2 py-1 flex justify-between items-center border-b">
        <span className="font-semibold text-gray-700">{day}</span>
        {dayDonations.length > 0 && (
          <Badge
            variant={dayTotal >= 0 ? "default" : "destructive"}
            className="flex items-center"
          >
            <DollarSign className="h-3 w-3 mr-1" />
            {formatCurrency(dayTotal)}
          </Badge>
        )}
      </div>

      {/* Donations List */}
      <div className="flex-grow overflow-y-auto p-1 space-y-1">
        {dayDonations.map((donation) => (
          <div
            key={donation.id}
            className={`
              cursor-pointer 
              px-2 py-1 
              rounded-md 
              text-xs 
              transition-colors 
              ${
                donation.transactionNature === "CREDIT"
                  ? "bg-green-50 hover:bg-green-100 text-green-800 border-l-2 border-green-500"
                  : "bg-red-50 hover:bg-red-100 text-red-800 border-l-2 border-red-500"
              }
            `}
            onClick={() => openDonationEditor(donation.id, day)}
          >
            <div className="font-medium truncate">
              {donation.userName || donation.name || "Unknown User"}
            </div>
            <div className="text-[0.7rem] opacity-70">
              {formatCurrency(donation.amount)} ({donation.transactionNature})
            </div>
          </div>
        ))}
      </div>

      {/* Add Donation Button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full border-t text-gray-500 hover:text-blue-600 hover:bg-blue-50"
        onClick={() => {
          setSelectedUser(null);
          openAddDonationDialog(day);
        }}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Donation
      </Button>
    </div>
  );
};

export default DonationDayCell;