import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthNavigationProps {
  monthNames: string[];
  currentMonth: number;
  currentYear: number;
  previousMonth: () => void;
  nextMonth: () => void;
}

const MonthNavigation: React.FC<MonthNavigationProps> = ({
  monthNames,
  currentMonth,
  currentYear,
  previousMonth,
  nextMonth,
}) => (
  <div className="flex justify-between items-center">
    <Button variant="outline" onClick={previousMonth} className="flex items-center" size="sm">
      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
    </Button>

    <div className="text-xl font-semibold">
      {monthNames[currentMonth]} {currentYear}
    </div>

    <Button variant="outline" onClick={nextMonth} className="flex items-center" size="sm">
      Next <ChevronRight className="h-4 w-4 ml-1" />
    </Button>
  </div>
);

export default MonthNavigation;
