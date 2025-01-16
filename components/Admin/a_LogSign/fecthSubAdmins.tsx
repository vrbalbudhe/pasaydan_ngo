"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiDeleteBin7Line } from "react-icons/ri";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";

interface SubAdmin {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
}

export default function SubAdminsTable() {
  const [subAdminData, setSubAdminData] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllSubAdmins = async () => {
      try {
        const response = await fetch("/api/admin/subadmin");
        const data = await response.json();
        setSubAdminData(data);
      } catch (error) {
        console.error("Error fetching sub-admins:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSubAdmins();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this sub-admin?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch("/api/subadmin/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("Sub-Admin deleted successfully.");
        setSubAdminData((prev) =>
          prev.filter((subAdmin) => subAdmin.id !== id)
        );
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting sub-admin:", error);
      alert("An error occurred while deleting the sub-admin.");
    }
  };

  const filteredSubAdmins = subAdminData.filter((subAdmin) => {
    const query = searchQuery.toLowerCase();
    return (
      subAdmin.name?.toLowerCase().includes(query) ||
      subAdmin.email?.toLowerCase().includes(query) ||
      subAdmin.mobile?.includes(query) ||
      subAdmin.address?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Stats Section */}
      <Card className="w-1/3">
        <CardContent className="flex items-center p-6 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Sub-Admins
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {subAdminData.length}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Search Section */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search Sub-Admins"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
        />
        <button
          onClick={() => console.log("Filter logic can be added here")}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Filter
        </button>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="w-full h-[400px] flex flex-col gap-3 justify-center items-center text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-lg font-medium">
            Loading Sub-Admins Information...
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Sub-Admins List
            </h2>
            <p className="text-sm text-gray-500">
              Manage and monitor all registered sub-admins
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Index
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    ID
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Name
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Email
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Mobile
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Address
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubAdmins.map((subAdmin, index) => (
                  <TableRow
                    key={subAdmin.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {subAdmin.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {subAdmin.name || "NA"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {subAdmin.email || "NA"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {subAdmin.mobile || "NA"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {subAdmin.address || "NA"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleDelete(subAdmin?.id || "NA")}
                        className="text-red-500 hover:text-red-700 focus:outline-none p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <RiDeleteBin7Line size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
