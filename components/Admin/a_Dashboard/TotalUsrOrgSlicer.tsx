"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Activity, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface User {
  id: string;
  fullname: string;
  email: string;
  mobile: string;
  userType: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  email: string;
  mobile: string;
  userType: string;
  createdAt: string;
}

const TotalUsrOrgSlicer = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [orgData, setOrgData] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, orgResponse] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/org"),
        ]);

        const users = await userResponse.json();
        const orgs = await orgResponse.json();

        setUserData(users);
        setOrgData(orgs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processGrowthDataByMonth = () => {
    const getMonthYear = (dateString: string) => {
      const date = new Date(dateString);
      return `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
    };

    const countByMonth = (data: { createdAt: string }[]) => {
      return data.reduce((acc: { [key: string]: number }, item) => {
        const monthYear = getMonthYear(item.createdAt);
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      }, {});
    };

    const userCounts = countByMonth(userData);
    const orgCounts = countByMonth(orgData);

    const allMonths = Array.from(
      new Set([...Object.keys(userCounts), ...Object.keys(orgCounts)])
    ).sort(
      (a, b) =>
        new Date(parseInt(a.split(" ")[1]), new Date(a).getMonth()).getTime() -
        new Date(parseInt(b.split(" ")[1]), new Date(b).getMonth()).getTime()
    );

    return allMonths.map((month) => ({
      month,
      Users: userCounts[month] || 0,
      Organizations: orgCounts[month] || 0,
    }));
  };

  const StatCard = ({ title, count, icon, color }: any) => (
    <div className={`bg-${color}-50 p-6 rounded-xl`}>
      <div className="flex items-center gap-4">
        <div className={`bg-${color}-100 p-4 rounded-xl`}>{icon}</div>
        <div>
          <p className={`text-sm font-medium text-${color}-600`}>{title}</p>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1" />
          ) : (
            <h3 className="text-3xl font-bold text-gray-900">
              {count.toLocaleString()}
            </h3>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Platform Overview
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Users and Organizations statistics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
            <span className="text-sm text-gray-600">Live Data</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <StatCard
            title="Total Users"
            count={userData.length}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            color="blue"
          />
          <StatCard
            title="Total Organizations"
            count={orgData.length}
            icon={<Building2 className="h-6 w-6 text-purple-600" />}
            color="purple"
          />
        </div>

        {/* Growth Chart */}
        {!loading && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">
                Growth Trend
              </h3>
            </div>
            <div className="h-72 w-full bg-white rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processGrowthDataByMonth()}>
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={12}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Users"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Organizations"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="flex justify-end">
          <p className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalUsrOrgSlicer;
