import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import DonationDayCell from "./DonationDayCell";

interface CalendarViewProps {
    monthNames: string[];
    currentMonth: number;
    currentYear: number;
    calendarGrid: (number | null)[][];
    dayLabels: string[];
    getDayDonations: (day: number) => any[];
    getDayTotal: (day: number) => number;
    getUserName: (userId: string) => string;  // Added
    openDonationEditor: (userId: string, day: number) => void;
    setSelectedUser: (userId: string | null) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
    monthNames,
    currentMonth,
    currentYear,
    calendarGrid,
    dayLabels,
    getDayDonations,
    getDayTotal,
    getUserName,
    openDonationEditor,
    setSelectedUser,
}) => (
    <Card>
        <CardContent className="p-4">
            <div className="grid grid-cols-7 mb-2">
                {dayLabels.map((day, index) => (
                    <div key={index} className="text-center font-medium text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {calendarGrid.flat().map((day, index) => (
                    <DonationDayCell
                        key={index}
                        day={day}
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        getDayDonations={getDayDonations}
                        getDayTotal={getDayTotal}
                        getUserName={getUserName}  // Passed
                        openDonationEditor={openDonationEditor}
                        setSelectedUser={setSelectedUser}
                    />
                ))}
            </div>
        </CardContent>
    </Card>
);

export default CalendarView;
