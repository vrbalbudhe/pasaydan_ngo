// components/Admin/a_Certifications/UsersCertificateDetails.tsx
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
import { Users, Loader2, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface LoadingState {
  [key: string]: {
    download: boolean;
    email: boolean;
  };
}

export default function UsersCertificateDetails() {
  const [userData, setUserData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

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
    const confirmed = confirm(
      "Are you sure you want to delete this certificate?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch("/api/certificate/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Certificate deleted successfully.`);
        setUserData((prev) => prev.filter((user) => user.id !== id));
      } else {
        alert(`Error deleting certificate: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting.");
    }
  };

  const handleEmailCertificate = async (
    userName: string,
    userEmail: string,
    donationId: string,
    id: string,
    type: string
  ) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], email: true },
    }));

    try {
      const response = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, userEmail, donationId, type }),
      });

      if (response.ok) {
        alert(`Certificate sent to ${userEmail}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send certificate.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], email: false },
      }));
    }
  };

  const handleDownloadCertificate = async (
    userName: string,
    userEmail: string,
    donationId: string,
    id: string,
    type: string
  ) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], download: true },
    }));

    try {
      const response = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          userEmail: "no-email@example.com", // Dummy email to skip email sending
          donationId,
          type,
          downloadOnly: true, // Add this flag if you want to modify the backend
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Create link to download the file
        const downloadUrl = data.certificateUrl;
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `${userName}-certificate.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to download certificate");
      }
    } catch (error: any) {
      console.error("Error downloading certificate:", error);
      alert(error.message || "Failed to download certificate");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], download: false },
      }));
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
    <div className="w-full px-2 sm:px-6 lg:px-8 flex flex-col md:items-start space-y-6">
      {/* Search Bar */}
      <div className="w-full md:max-w-md">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 w-full rounded-md md:w-full"
        />
      </div>

      {/* Stats Section */}
      <Card>
        <CardContent className="flex items-center md:items-start p-6 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
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

      {/* Table Section */}
      {loading ? (
        <div className="w-full h-[400px] flex flex-col gap-3 justify-center items-center text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden pl-2 pr-2 md:pl-0 md:pr-0">
          <div className="md:w-full w-full rounded-lg shadow md:p-4 overflow-x-auto">
            <h2 className="text-2xl mt-10 md:mt-0 md:text-lg font-semibold text-gray-900">
              Certificates List
            </h2>
            <p className="text-sm text-gray-500">Manage all certificates</p>

            <div className="overflow-x-auto mt-10 md:mt-0 w-full">
<Table className="hidden md:block">
  <TableHeader>
    <TableRow>
      <TableHead>Index</TableHead>
      <TableHead>ID</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Mobile</TableHead>
      <TableHead className="w-1/4">Description</TableHead> {/* Added width control */}
      <TableHead>Type</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredUsers.map((user, index) => (
      <TableRow key={user.id}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{user.donationId}</TableCell>
        <TableCell>
          {highlightText(user.fullname || "NA", searchQuery)}
        </TableCell>
        <TableCell>
          {highlightText(user.email || "NA", searchQuery)}
        </TableCell>
        <TableCell>
          {highlightText(user.mobile || "NA", searchQuery)}
        </TableCell>
        <TableCell className="max-w-xs whitespace-normal break-words">
          {highlightText(user.description || "NA", searchQuery)}
        </TableCell>
        <TableCell>{user.type}</TableCell>
        
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    handleDownloadCertificate(
                                      user.fullname,
                                      user.email,
                                      user.donationId,
                                      user.id,
                                      user.type
                                    )
                                  }
                                  disabled={loadingStates[user.id]?.download}
                                >
                                  {loadingStates[user.id]?.download ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Download className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download Certificate</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    handleEmailCertificate(
                                      user.fullname,
                                      user.email,
                                      user.donationId,
                                      user.id,
                                      user.type
                                    )
                                  }
                                  disabled={loadingStates[user.id]?.email}
                                >
                                  {loadingStates[user.id]?.email ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Mail className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Email Certificate</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDelete(user.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <RiDeleteBin7Line className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Certificate</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* adding the another card section for the smaller screens */}
              <div className="w-full h-full flex flex-col gap-2">
                {filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="group md:hidden w-full p-5  bg-white"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-2">
                        {/* Header Section */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {user.fullname}
                            </h3>
                            <p className="text-sm font-medium text-blue-600">
                              {user.email}
                            </p>
                          </div>
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                            {user.type}
                          </span>
                        </div>

                        {/* Details Section */}
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Mobile
                            </p>
                            <p className="text-sm text-gray-900">
                              {user.mobile}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Donation ID
                            </p>
                            <p className="text-sm text-gray-900">
                              {user.donationId}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="py-2">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {user.description}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-2 pt-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="hover:bg-blue-50 transition-colors"
                                  onClick={() =>
                                    handleDownloadCertificate(
                                      user.fullname,
                                      user.email,
                                      user.donationId,
                                      user.id,
                                      user.type
                                    )
                                  }
                                  disabled={loadingStates[user.id]?.download}
                                >
                                  {loadingStates[user.id]?.download ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Download className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download Certificate</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="hover:bg-blue-50 transition-colors"
                                  onClick={() =>
                                    handleEmailCertificate(
                                      user.fullname,
                                      user.email,
                                      user.donationId,
                                      user.id,
                                      user.type
                                    )
                                  }
                                  disabled={loadingStates[user.id]?.email}
                                >
                                  {loadingStates[user.id]?.email ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Mail className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Email Certificate</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDelete(user.id)}
                                  className="hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <RiDeleteBin7Line className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Certificate</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
