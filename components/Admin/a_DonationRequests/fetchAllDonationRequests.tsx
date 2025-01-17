"use client";
import { useState, useEffect } from "react";
import DonationRequestCard from "@/components/Admin/a_DonationRequests/requestCard";
import { Badge } from "@/components/ui/badge";

interface DonationRequestCardProps {
  id: string;
  fullname: string;
  mobile: string;
  email: string;
  address: string;
  type: string;
  quantity: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface StatusCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface FetchAllDonationRequestsProps {
  statusFilter: "All" | "Pending" | "Approved" | "Rejected";
  searchQuery: string;
  onStatusSelect: (status: "All" | "Pending" | "Approved" | "Rejected") => void;
}

export default function FetchAllDonationRequests({
  statusFilter,
  searchQuery,
  onStatusSelect,
}: FetchAllDonationRequestsProps) {
  const [donationRequests, setDonationRequests] = useState<
    DonationRequestCardProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchDonationRequests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/donation/request/get");
        if (!response.ok) {
          throw new Error("Failed to fetch donation requests");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setDonationRequests(data);
          const counts = data.reduce(
            (acc, request) => {
              acc.all++;
              acc[
                request.status.toLowerCase() as keyof Omit<StatusCounts, "all">
              ]++;
              return acc;
            },
            {
              all: 0,
              pending: 0,
              approved: 0,
              rejected: 0,
            }
          );
          setStatusCounts(counts);
          setError(null);
        } else {
          throw new Error("Invalid data structure received");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching donation requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonationRequests();
  }, []);

  // Enhanced search function
  const searchInField = (field: string, searchQuery: string): boolean => {
    return field.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Filter and sort the requests with enhanced search
  const filteredRequests = donationRequests
    .filter((request) => {
      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      if (!matchesStatus) return false;

      if (searchQuery === "") return true;

      // Enhanced search across all fields
      const searchableFields = [
        request.fullname,
        request.mobile,
        request.email,
        request.address,
        request.type,
        request.quantity,
      ];

      return searchableFields.some((field) =>
        searchInField(field.toString(), searchQuery)
      );
    })
    .sort((a, b) => {
      const statusPriority = { Pending: 0, Approved: 1, Rejected: 2 };
      return statusPriority[a.status] - statusPriority[b.status];
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 text-red-700">
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  const statusButtons = [
    { label: "All", count: statusCounts.all },
    { label: "Pending", count: statusCounts.pending },
    { label: "Approved", count: statusCounts.approved },
    { label: "Rejected", count: statusCounts.rejected },
  ];

  return (
    <div>
      {/* Status Filters with updated styling */}
      <div className="flex flex-wrap gap-3 mb-6">
        {statusButtons.map(({ label, count }) => (
          <button
            key={label}
            onClick={() => onStatusSelect(label as any)}
            className={`inline-flex items-center px-6 py-2 rounded text-sm font-medium transition-colors
              ${
                statusFilter === label
                  ? "bg-gray-200 text-slate-800 rounded-full" // Selected state
                  : "bg-inherit text-slate-900 border-2 border-slate-200 rounded-full hover:bg-gray-200" // Default state
              }`}
          >
            {label}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs 
              ${
                statusFilter === label
                  ? "bg-gray-100 text-black"
                  : "bg-gray-700 text-white"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-50 text-slate-600">
            <span className="text-sm">No donation requests found</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((request) => (
            <DonationRequestCard key={request.id} {...request} />
          ))}
        </div>
      )}
    </div>
  );
}

{
  /*"use client";
import { useState, useEffect } from "react";
import DonationRequestCard from "@/components/Admin/a_DonationRequests/requestCard";

interface DonationRequestCardProps {
  id: string;
  fullname: string;
  mobile: string;
  email: string;
  address: string;
  type: string;
  quantity: string;
  status: "Pending" | "Approved" | "Rejected";
}

export default function FetchAllDonationRequests() {
  const [donationRequests, setDonationRequests] = useState<
    DonationRequestCardProps[]
  >([]);

  useEffect(() => {
    const fetchDonationRequests = async () => {
      try {
        const response = await fetch("/api/donation/request/get");
        if (!response.ok) {
          throw new Error("Failed to fetch donation requests");
        }

        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setDonationRequests(data);
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching donation requests:", error);
      }
    };

    fetchDonationRequests();
  }, []);

  return (
    <>
      {donationRequests.map((request, index) => (
        <DonationRequestCard
          key={index}
          id={request.id}
          fullname={request.fullname}
          mobile={request.mobile}
          email={request.email}
          address={request.address}
          type={request.type}
          quantity={request.quantity}
          status={request.status}
        />
      ))}
    </>
  );
}*/
}
