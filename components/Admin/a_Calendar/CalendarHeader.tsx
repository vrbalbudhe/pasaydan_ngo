import React from "react";
import { CalendarCheck } from "lucide-react";

const CalendarHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
      <div className="flex items-center space-x-4">
        <CalendarCheck className="h-10 w-10 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-800">Pasaydan Donations</h1>
      </div>
    </div>
  );
};

export default CalendarHeader;