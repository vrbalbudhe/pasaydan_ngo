//components\Admin\a_Dashboard\totalDonationsReceived.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Coffee,
  Utensils,
  Shirt,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface Donation {
  id: string;
  fullname: string;
  email: string;
  mobile: string;
  quantity: string;
  status: string;
  type: string;
  address: string;
}

const DonationsOverview = () => {
  const [donationData, setDonationData] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDonations = async () => {
      try {
        const response = await fetch("/api/donation/request/get");
        if (!response.ok) throw new Error("Failed to fetch donations");
        const data: Donation[] = await response.json();
        setDonationData(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDonations();
  }, []);

  const statusCounts = {
    pending: donationData.filter((d) => d.status.toLowerCase() === "pending")
      .length,
    approved: donationData.filter((d) => d.status.toLowerCase() === "approved")
      .length,
    rejected: donationData.filter((d) => d.status.toLowerCase() === "rejected")
      .length,
  };

  const typeCounts: { [key: string]: number } = {};
  donationData.forEach((donation) => {
    const type = donation.type.toLowerCase();
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const totalDonations = donationData.length;

  const LoadingIndicator = () => (
    <div className="flex items-center space-x-2">
      <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
      <span className="text-sm text-gray-500">Loading data...</span>
    </div>
  );

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Donations Overview
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {loading
                ? "Calculating statistics..."
                : `Total Donations: ${totalDonations}`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              Real-time Updates
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <div className="space-y-6">
            {/* Status Overview Section */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-700">
                    {statusCounts.pending}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Approved</p>
                  <p className="text-xl font-bold text-green-700">
                    {statusCounts.approved}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-red-50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-red-600">Rejected</p>
                  <p className="text-xl font-bold text-red-700">
                    {statusCounts.rejected}
                  </p>
                </div>
              </div>
            </div>

            {/* Donation Types Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Donation Types
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(typeCounts).map(([type, count]) => {
                  const TypeIcon = (() => {
                    switch (type.toLowerCase()) {
                      case "food":
                        return Utensils;
                      case "money":
                        return DollarSign;
                      case "clothes":
                        return Shirt;
                      case "drinks":
                        return Coffee;
                      default:
                        return Users;
                    }
                  })();

                  return (
                    <div
                      key={type}
                      className="flex items-center p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <TypeIcon className="h-6 w-6 text-blue-500" />
                      <div className="ml-3">
                        <p className="text-xs font-medium text-gray-500 capitalize">
                          {type}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {count}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <span className="ml-2 text-sm text-blue-700">
                  {statusCounts.pending > 0
                    ? `${statusCounts.pending} donations need your attention`
                    : "No pending donations"}
                </span>
              </div>
              <span className="text-xs text-blue-600 font-medium">
                Success Rate:{" "}
                {totalDonations > 0
                  ? `${Math.round((statusCounts.approved / totalDonations) * 100)}%`
                  : "0%"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DonationsOverview;
