import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionOverview from "@/components/Admin/a_Dashboard/TransactionOverview";
import DriveOverview from "@/components/Admin/a_Dashboard/DriveOverview";
import TotalUsrOrgSlicer from "@/components/Admin/a_Dashboard/TotalUsrOrgSlicer";
import { LayoutDashboard } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="md:p-8 p-2 space-y-6">
      <div className="w-full h-20 flex justify-between items-center px-4 pt-9">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded-lg">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, Admin
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TransactionOverview />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DriveOverview />
          <TotalUsrOrgSlicer />
        </div>
      </div>
    </div>
  );
}