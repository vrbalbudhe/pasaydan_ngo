// components/Admin/a_Calendar/CalendarMetrics.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CalendarDays, CalendarRange } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CalendarMetricsProps {
  monthTotal: number;
  overallTotal: number;
}

const CalendarMetrics: React.FC<CalendarMetricsProps> = ({ monthTotal, overallTotal }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-2 flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span>Monthly Total</span>
            </div>
            <div className={`text-2xl font-bold ${monthTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(monthTotal)}
            </div>
          </div>
          <TrendingUp className={`h-10 w-10 ${monthTotal >= 0 ? "text-green-400" : "text-red-400"}`} />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-2 flex items-center">
              <CalendarRange className="h-4 w-4 mr-1" />
              <span>All-Time Total</span>
            </div>
            <div className={`text-2xl font-bold ${overallTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(overallTotal)}
            </div>
          </div>
          <TrendingUp className={`h-10 w-10 ${overallTotal >= 0 ? "text-green-400" : "text-red-400"}`} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarMetrics;