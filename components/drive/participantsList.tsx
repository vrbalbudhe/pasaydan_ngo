"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Search,
  FileDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Define the participant type based on your data structure
type Participant = {
  id: string;
  fullName: string;
  contact: string;
  school: string;
  standard: string;
  area: string;
  createdAt: string;
  driveId: string;
};

// Props for our component
type ParticipantsListProps = {
  driveId: string;
};

export default function ParticipantsList({ driveId }: ParticipantsListProps) {
  // State management
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Participant | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch participants data
  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/participants/${driveId}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch participants: ${response.statusText}`
          );
        }

        const data = await response.json();
        setParticipants(data);
      } catch (err) {
        console.error("Error fetching participants:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (driveId) {
      fetchParticipants();
    }
  }, [driveId]);

  // Handle sorting
  const handleSort = (field: keyof Participant) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort participants
  const filteredAndSortedParticipants = participants
    .filter((participant) => {
      if (!searchTerm) return true;

      // Search across multiple fields
      const searchTermLower = searchTerm.toLowerCase();
      return (
        participant.fullName.toLowerCase().includes(searchTermLower) ||
        participant.school.toLowerCase().includes(searchTermLower) ||
        participant.area.toLowerCase().includes(searchTermLower) ||
        participant.contact.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  // Export to CSV
  const exportToCSV = () => {
    if (filteredAndSortedParticipants.length === 0) return;

    const headers = [
      "Name",
      "Contact",
      "School",
      "Standard",
      "Area",
      "Registration Date",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredAndSortedParticipants.map((p) => {
        const date = new Date(p.createdAt).toLocaleDateString();
        return [
          `"${p.fullName}"`,
          `"${p.contact}"`,
          `"${p.school}"`,
          `"${p.standard}"`,
          `"${p.area}"`,
          `"${date}"`,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `participants-${driveId}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render sort indicator
  const renderSortIndicator = (field: keyof Participant) => {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="mt-2 text-gray-600">Loading participants...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md">
        <p className="font-medium">Error loading participants</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  // Empty state
  if (participants.length === 0) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-600">No participants found for this drive.</p>
      </div>
    );
  }

  return (
    <div className="bg-white w-[90%] rounded-lg shadow">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Participants ({filteredAndSortedParticipants.length})
        </h2>

        <div className="flex items-center gap-3">
          {/* Search field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search participants..."
              className="pl-9 pr-4 py-2 border rounded-md text-sm w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Export button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm"
          >
            <FileDown className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("fullName")}
              >
                Name {renderSortIndicator("fullName")}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("contact")}
              >
                Contact {renderSortIndicator("contact")}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("school")}
              >
                School {renderSortIndicator("school")}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("standard")}
              >
                Standard {renderSortIndicator("standard")}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("area")}
              >
                Area {renderSortIndicator("area")}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("createdAt")}
              >
                Registered On {renderSortIndicator("createdAt")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredAndSortedParticipants.map((participant) => (
              <tr key={participant.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {participant.fullName}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`tel:${participant.contact}`}
                    className="text-blue-600 hover:underline"
                  >
                    {participant.contact}
                  </a>
                </td>
                <td className="px-4 py-3">{participant.school}</td>
                <td className="px-4 py-3">{participant.standard}</td>
                <td className="px-4 py-3">{participant.area}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(participant.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No results from search */}
      {searchTerm && filteredAndSortedParticipants.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No participants match your search.
        </div>
      )}
    </div>
  );
}
