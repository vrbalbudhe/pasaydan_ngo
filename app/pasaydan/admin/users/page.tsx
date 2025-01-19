"use client";
import UsersTable from "@/components/Admin/a_ManageUser/usersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Users } from "lucide-react";

export default function ManageUser() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full min-h-screen pt-14 p-6 bg-gray-50">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-sm text-gray-500 mt-1">
              Search and manage registered users
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-grow max-w-3xl">
            <Input
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm 
                         text-gray-900 placeholder:text-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-shadow duration-200"
              type="search"
              id="search"
              placeholder="Search by name, email, or mobile number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-8 w-8 bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-full focus:outline-none"
                onClick={() => setSearchQuery("")}
                variant="ghost"
                size="sm"
              >
                ×
              </Button>
            )}
          </div>
          <Button
            className="min-w-[100px] bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-sm 
                       transition-colors duration-200 py-2.5"
            onClick={() => setSearchQuery("")}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <UsersTable searchQuery={searchQuery} />
      </div>
    </div>
  );
}
