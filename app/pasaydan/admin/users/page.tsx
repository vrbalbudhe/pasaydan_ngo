"use client";
import UsersTable from "@/components/Admin/a_ManageUser/usersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ManageUser() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full min-h-screen pt-14 p-6 bg-gray-50">
      {/* Header Section */}
      <div className="mb-6 h-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Manage Users</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Input
            className="bg-gray-100 text-gray-800 border border-gray-300 rounded-md p-2 w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="search"
            id="search"
            placeholder="Search User"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            className="bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 px-4 py-2"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm rounded p-4 border border-gray-300">
        <UsersTable searchQuery={searchQuery} />
      </div>
    </div>
  );
}
