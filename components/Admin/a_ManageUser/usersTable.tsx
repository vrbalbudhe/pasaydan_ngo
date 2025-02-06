import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { RiBuilding2Line, RiDeleteBin7Line, RiUser3Line } from "react-icons/ri";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: string;
  fullname: string;
  email: string;
  mobile: string;
  userType: string;
  address: string;
}
interface Invoice1 {
  id: string;
  orgId: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
}

interface UsersTableProps {
  searchQuery: string;
}

export default function UsersTable({ searchQuery }: UsersTableProps) {
  const [userData, setUserData] = useState<Invoice[]>([]);
  const [orgData, setOrgData] = useState<Invoice1[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchAllOrgs = async () => {
      try {
        const response = await fetch("/api/org");
        const data = await response.json();
        setOrgData(data);
      } catch (error) {
        console.error("Error fetching Orgs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrgs();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("User deleted successfully.");
        setUserData((prev) => prev.filter((user) => user.id !== id));
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  const handleDeleteOrganisation = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this Organisation?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch("/api/org/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("Organisation deleted successfully.");
        setOrgData((prev) => prev.filter((org) => org.id !== id));
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting Organisation:", error);
      alert("An error occurred while deleting the Organisation.");
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
  const filteredOrgs = orgData.filter((org) => {
    const query = searchQuery.toLowerCase();
    return (
      org.name?.toLowerCase().includes(query) ||
      org.email?.toLowerCase().includes(query) ||
      org.mobile?.includes(query) ||
      org.address?.toLowerCase().includes(query)
    );
  });

  // Updated highlightText function to ensure the input is a string
  const highlightText = (text: any, query: string) => {
    const safeText = text != null ? String(text) : "";
    if (!query) return safeText;
    const parts = safeText.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className=" overflow-x-hidden">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {userData.length}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="md:w-full">
          <CardContent className="flex items-center p-6 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Organizations
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {orgData.length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section for Users */}
      {loading ? (
        <div className="w-full h-[400px] flex flex-col gap-3 justify-center items-center text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-lg font-medium">Loading Users Information...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow mt-10 md:mt-0">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Users List</h2>
            <p className="text-sm text-gray-500">
              Manage and monitor all registered users
            </p>
          </div>

          <div className="overflow-x-auto hidden md:block">
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
                    Type
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {user.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {highlightText(user.fullname || "NA", searchQuery)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {highlightText(user.email || "NA", searchQuery)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {highlightText(user.mobile || "NA", searchQuery)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {highlightText(user.address || "NA", searchQuery)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {user?.userType}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleDelete(user?.id || "NA")}
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
          <div className="w-full h-full flex flex-col gap-2 mt-10 md:hidden">
            {filteredUsers.map((user, index) => (
              <Card
                key={user.id}
                className="group border border-gray-300 overflow-hidden  bg-white"
              >
                <CardContent className="p-6">
                  {/* Header with Avatar */}
                  <div className="flex items-start justify-between p-5 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <RiUser3Line className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          User #{index + 1}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {highlightText(user.fullname || "NA", searchQuery)}
                        </h3>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${
                        user?.userType === "admin"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {user?.userType || "user"}
                    </Badge>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 ">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 text-sm font-medium text-gray-500">
                        Email
                      </div>
                      <div className="text-sm text-gray-900">
                        {highlightText(user.email || "NA", searchQuery)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 text-sm font-medium text-gray-500">
                        Mobile
                      </div>
                      <div className="text-sm text-gray-900">
                        {highlightText(user.mobile || "NA", searchQuery)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 text-sm font-medium text-gray-500">
                        ID
                      </div>
                      <div className="text-sm text-gray-900">{user.id}</div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Address
                    </p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {highlightText(user.address || "NA", searchQuery)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleDelete(user?.id || "NA")}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-red-500 hover:text-red-700 
                         hover:bg-red-50 border border-gray-300 rounded-lg transition-colors duration-200"
                    >
                      <RiDeleteBin7Line className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Table Section for Organizations */}
      {loading ? (
        <div className="w-full h-[400px] flex flex-col gap-3 justify-center items-center text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-lg font-medium">
            Loading Organizations Information...
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b mt-10 mb-10 md:mt-0 md:mb-0 border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Organizations List
            </h2>
            <p className="text-sm text-gray-500">
              Manage and monitor all registered Organizations
            </p>
          </div>

          <div className="overflow-x-auto hidden md:block">
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
                    Org-ID
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org, index) => (
                  <TableRow
                    key={org.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {org.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {highlightText(org.name || "NA", searchQuery)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {highlightText(org.email || "NA", searchQuery)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {highlightText(org.mobile || "NA", searchQuery)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {highlightText(org.address || "NA", searchQuery)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800">
                      {org.orgId}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      <button
                        onClick={() =>
                          handleDeleteOrganisation(org?.id || "NA")
                        }
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

          {/* adding small scrrens cards here.. */}
          <div className="md:hidden w-full h-full flex flex-col gap-2">
            {filteredOrgs.map((org, index) => (
              <Card
                key={org.id}
                className="group p-3 overflow-hidden border-gray-300 bg-white"
              >
                <CardContent className="p-6">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <RiBuilding2Line className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Organization #{index + 1}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {highlightText(org.name || "NA", searchQuery)}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700"
                    >
                      {org.orgId}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 text-sm font-medium text-gray-500">
                        Email
                      </div>
                      <div className="text-sm text-gray-900">
                        {highlightText(org.email || "NA", searchQuery)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 text-sm font-medium text-gray-500">
                        Mobile
                      </div>
                      <div className="text-sm text-gray-900">
                        {highlightText(org.mobile || "NA", searchQuery)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 text-sm font-medium text-gray-500">
                        ID
                      </div>
                      <div className="text-sm text-gray-900">{org.id}</div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Address
                    </p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {highlightText(org.address || "NA", searchQuery)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleDeleteOrganisation(org?.id || "NA")}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-red-500 border border-gray-300 hover:text-red-700 
                         hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <RiDeleteBin7Line className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
