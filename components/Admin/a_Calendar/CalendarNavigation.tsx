import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarNavigationProps {
  monthNames: string[];
  currentMonth: number;
  currentYear: number;
  previousMonth: () => void;
  nextMonth: () => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  monthNames,
  currentMonth,
  currentYear,
  previousMonth,
  nextMonth
}) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={previousMonth}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <h2 className="text-xl font-semibold text-gray-800">
        {monthNames[currentMonth]} {currentYear}
      </h2>
      <Button
        variant="outline"
        size="sm"
        onClick={nextMonth}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CalendarNavigation;