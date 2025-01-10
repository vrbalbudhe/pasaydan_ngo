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
import { Users, UserCheck, Loader2 } from "lucide-react";

interface Invoice {
  id: string;
  fullname: string;
  email: string;
  mobile: string;
  address: string;
}

interface UsersTableProps {
  searchQuery: string;
}

export default function UsersTable({ searchQuery }: UsersTableProps) {
  const [userData, setUserData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

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

  const filteredUsers = userData.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.mobile?.includes(query) ||
      user.address?.toLowerCase().includes(query)
    );
  });

  const highlightText = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
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
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{userData.length}</h3>
            </div>
          </CardContent>
        </Card>
        
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="w-full h-[400px] flex flex-col gap-3 justify-center items-center text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-lg font-medium">Loading Users Information...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Users List</h2>
            <p className="text-sm text-gray-500">Manage and monitor all registered users</p>
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
                      User
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
        </div>
      )}
    </div>
  );
}




{/*import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";

interface Invoice {
  id: string;
  fullname: string;
  email: string;
  mobile: string;
  address: string;
}

interface UsersTableProps {
  searchQuery: string;
}

export default function UsersTable({ searchQuery }: UsersTableProps) {
  const [userData, setUserData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

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

  const filteredUsers = userData.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.mobile?.includes(query) ||
      user.address?.toLowerCase().includes(query)
    );
  });

  const highlightText = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
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
    <>
      {loading ? (
        <div className="w-full h-[400px] flex justify-center items-center text-xl text-gray-600">
          Fetching Users Information...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm shadow-sm border border-gray-300">
          <Table className="min-w-full bg-white">
            <TableHeader>
              <TableRow className="bg-gray-100">
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
                  className="hover:bg-gray-100 transition duration-150"
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
                    User
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-center">
                    <button
                      onClick={() => handleDelete(user?.id || "NA")}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <RiDeleteBin7Line size={20} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}*/}
