// components/Admin/a_Calendar/CalendarNavigation.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  CalendarIcon as YearIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalendarNavigationProps {
  monthNames: string[];
  currentMonth: number;
  currentYear: number;
  previousMonth: () => void;
  nextMonth: () => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  monthNames,
  currentMonth,
  currentYear,
  previousMonth,
  nextMonth,
  setMonth,
  setYear
}) => {
  // Generate years from 2000 to current year
  const currentSystemYear = new Date().getFullYear();
  const yearRange = Array.from(
    { length: currentSystemYear - 1999 }, 
    (_, i) => 2000 + i
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={previousMonth}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {/* Current month/year display */}
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
      
      {/* Month and Year Selectors */}
      <div className="flex items-center gap-2">
        {/* Month Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[120px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{monthNames[currentMonth]}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="end">
            <div className="grid grid-cols-3 gap-1 p-2">
              {monthNames.map((month, index) => (
                <Button
                  key={month}
                  variant={currentMonth === index ? "default" : "ghost"}
                  className="text-xs h-9"
                  onClick={() => setMonth(index)}
                >
                  {month}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Year Selector with Scrollbar */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[100px] justify-start text-left font-normal">
              <YearIcon className="mr-2 h-4 w-4" />
              <span>{currentYear}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="end">
            <ScrollArea className="h-72 rounded-md p-1">
              <div className="flex flex-col gap-1 p-1">
                {yearRange.map((year) => (
                  <Button
                    key={year}
                    variant={currentYear === year ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setYear(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default CalendarNavigation;