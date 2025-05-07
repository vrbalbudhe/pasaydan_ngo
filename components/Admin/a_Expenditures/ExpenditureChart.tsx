// components/Admin/a_Expenditures/ExpenditureChart.tsx
"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface ExpenditureChartProps {
  type: "bar" | "pie";
  data: ChartData[];
  title: string;
  colors?: string[];
}

export default function ExpenditureChart({ 
  type, 
  data, 
  title, 
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"] 
}: ExpenditureChartProps) {
  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  width={80}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Amount"]} 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Amount" 
                  fill={colors[0]} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  innerRadius={50}
                  dataKey="value"
                  nameKey="name"
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), "Amount"]} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}