import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DonationDayCellProps {
    day: number | null;
    currentMonth: number;
    currentYear: number;
    getDayDonations: (day: number) => any[];
    getDayTotal: (day: number) => number;
    getUserName: (userId: string) => string;  // Added
    openDonationEditor: (userId: string, day: number) => void;
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
    setSelectedUser,
}) => {
    if (day === null) {
        return <div className="bg-gray-50 h-28 rounded-md" />;
    }

    const dayDonations = getDayDonations(day) || [];
    const dayTotal = getDayTotal(day);

    return (
        <div className="border rounded-md h-28 p-1 flex flex-col bg-white">
            <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{day}</span>
                {dayDonations.length > 0 && (
                    <Badge variant={dayTotal >= 0 ? "success" : "destructive"}>
                        {formatCurrency(dayTotal)}
                    </Badge>
                )}
            </div>

            <div className="flex-grow overflow-y-auto space-y-1 text-xs">
            {dayDonations.map((donation) => (
  <div
    key={donation.id}
    className={`truncate cursor-pointer px-1 py-0.5 rounded ${
      donation.transactionNature === "CREDIT"
        ? "bg-green-50 border-l-2 border-green-500"
        : "bg-red-50 border-l-2 border-red-500"
    }`}
    onClick={() => openDonationEditor(donation.userId, day)}
  >
    <div className="font-medium">{donation.userName || donation.name || "Unknown User"}</div>
    <div>{formatCurrency(donation.amount)} ({donation.transactionNature})</div>
  </div>
))}


            </div>

            <Button
                variant="ghost"
                size="sm"
                className="mt-1"
                onClick={() => {
                    setSelectedUser(null);
                    openDonationEditor("", day);
                }}
            >
                <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
        </div>
    );
};

export default DonationDayCell;
