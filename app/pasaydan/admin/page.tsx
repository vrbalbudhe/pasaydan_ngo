import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, DollarSign, ShoppingCart } from "lucide-react";
import TotalUsersSlicer from "@/components/Admin/a_Dashboard/TotalUsrOrgSlicer";
import TotalDonationsSlicer from "@/components/Admin/a_Dashboard/totalDonationsReceived";
import TotalUsrOrgSlicer from "@/components/Admin/a_Dashboard/TotalUsrOrgSlicer";

export default function AdminPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, Admin</p>
      </div>

      <div className="w-full flex flex-col gap-2">
        <TotalUsrOrgSlicer />
        <TotalDonationsSlicer />
      </div>
    </div>
  );
}
