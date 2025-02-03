"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";

interface Invoice {
  id: string;
  donationId: string;
  fullname: string;
  email: string;
  mobile: string;
  description: string;
  type: string;
  createdAt: string;
  address: string;
}

export default function UsersCertificateDetails() {
  const [userData, setUserData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch("/api/certificate/get");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching Certification details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch("/api/certificate/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(
          `User {${data?.deletedUserCertificatesDetails?.fullname}}'s Certification Details Deleted Successfully.`
        );
        setUserData((prev) => prev.filter((user) => user.id !== id));
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCertificateDownload = async (
    userName: string,
    userEmail: string,
    donationId: string,
    id: string,
    type: string
  ) => {
    if (!confirm("Are you sure you want to download the certificate?")) return;

    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, userEmail, donationId, type }),
      });

      if (response.ok) {
        alert("User Certification Generated Successfully.");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("An error occurred while generating the certificate.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredUsers = userData.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.mobile?.includes(query) ||
      user.address?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col md:items-center space-y-6">
      {/* Search Bar */}
      <div className="w-full md:max-w-md">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 min-w-[360px] rounded-md md:w-full"
        />
      </div>

      {/* Stats Section */}
      <div className="md:w-full min-w-[360px] ">
        <Card className="w-fit h-full flex justify-center items-center">
          <CardContent className="flex w-full justify-center items-center p-6 gap-4">
            <div className="bg-blue-50 md:p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Certificated Users
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {userData.length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="w-full flex flex-col items-center justify-center h-[400px] text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg font-medium">Loading Users Information...</p>
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <div className="md:w-full rounded-lg shadow p-4 overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-900">
              Users Certification List
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Manage and monitor all certificates generated for the users
            </p>

            <Table className="md:w-full w-[370px] md:min-w-max">
              <TableHeader className="md:w-full w-fit">
                <TableRow className="bg-gray-50">
                  <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Index
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    ID
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Name
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Email
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Mobile
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Type
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Actions
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Download
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <TableCell className="px-4 py-2">{index + 1}</TableCell>
                    <TableCell className="px-4 py-2">
                      {user.donationId}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {user.fullname || "NA"}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {user.email || "NA"}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {user.mobile || "NA"}
                    </TableCell>
                    <TableCell className="px-4 py-2">{user.type}</TableCell>
                    <TableCell className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <RiDeleteBin7Line size={20} />
                      </button>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <button
                        onClick={() =>
                          handleCertificateDownload(
                            user.fullname,
                            user.email,
                            user.donationId,
                            user.id,
                            user.type
                          )
                        }
                        className="bg-gray-900 text-white px-3 py-1 rounded-md hover:bg-gray-800 transition"
                      >
                        {loadingStates[user.id] ? "Loading..." : "Download"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        // <h1></h1>D
      )}
    </div>
  );
}
