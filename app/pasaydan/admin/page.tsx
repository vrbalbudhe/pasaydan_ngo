// app/pasaydan/admin/page.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionOverview from "@/components/Admin/a_Dashboard/TransactionOverview";
import DriveOverview from "@/components/Admin/a_Dashboard/DriveOverview";
import TotalUsrOrgSlicer from "@/components/Admin/a_Dashboard/TotalUsrOrgSlicer";

export default function AdminPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, Admin</p>
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