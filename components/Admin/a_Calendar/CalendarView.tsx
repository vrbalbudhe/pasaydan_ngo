import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import DonationDayCell from "./DonationDayCell";
import { motion } from "framer-motion";

interface CalendarViewProps {
  monthNames: string[];
  currentMonth: number;
  currentYear: number;
  calendarGrid: (number | null)[][];
  dayLabels: string[];
  getDayDonations: (day: number) => any[];
  getDayTotal: (day: number) => number;
  getUserName: (userId: string) => string;
  openDonationEditor: (userId: string, day: number) => void;
  openAddDonationDialog: (day: number) => void;
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
  openAddDonationDialog,
  setSelectedUser,
}) => (
  <Card className="bg-white shadow-md overflow-hidden">
    <CardContent className="p-6">
      {/* Day Labels */}
      <div className="grid grid-cols-7 mb-4 border-b pb-2">
        {dayLabels.map((day, index) => (
          <motion.div
            key={index}
            className="text-center font-semibold text-gray-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {day}
          </motion.div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarGrid.flat().map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
              delay: index * 0.05,
            }}
          >
            <DonationDayCell
              day={day}
              currentMonth={currentMonth}
              currentYear={currentYear}
              getDayDonations={getDayDonations}
              getDayTotal={getDayTotal}
              getUserName={getUserName}
              openDonationEditor={openDonationEditor}
              openAddDonationDialog={openAddDonationDialog}
              setSelectedUser={setSelectedUser}
            />
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default CalendarView;
