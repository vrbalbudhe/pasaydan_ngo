// page.tsx
"use client";
import { useState } from "react";
import FetchAllDonationRequests from "@/components/Admin/a_DonationRequests/fetchAllDonationRequests";
import { Search, Heart } from "lucide-react";

type StatusType = "All" | "Pending" | "Approved" | "Rejected";

export default function DonationRequest() {
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 pb-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Donation Requests</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage all incoming donation requests</p>
          </div>
        </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search anything..."
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6">
          <FetchAllDonationRequests 
            statusFilter={selectedStatus} 
            searchQuery={searchQuery} 
            onStatusSelect={setSelectedStatus}
          />
        </div>
      </div>
    </div>
  );
}



{/*import FetchAllDonationRequests from "@/components/Admin/a_DonationRequests/fetchAllDonationRequests";

export default function DonationRequest() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="w-full h-20 flex justify-between mt-10 items-center border-b pb-4">
        <h1 className="tracking-tight text-slate-800 text-2xl font-bold">
          Manage Donation Requests
        </h1>
      </div>
      <div className="mt-6 justify-start items-start flex-wrap flex gap-2 w-full">
        <FetchAllDonationRequests />
      </div>
    </div>
  );
}*/}
