"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Function to generate a random donation ID
const generateRandomDonationId = () => {
    return Math.random().toString(36).substr(2, 9); // Generate random string for donation ID
  };

export default function Certificates() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [donationId, setDonationId] = useState(generateRandomDonationId()); // Automatically generate donation ID
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDonationId(generateRandomDonationId());
  }, []);

  const handleGenerateCertificate = async () => {
    if (!name || !email) {
      alert("Please fill out both fields.");
      return;
    }

    const donationId = generateRandomDonationId(); // Assuming this generates a random ID
    const certificateData = { userName: name, userEmail: email, donationId };

    try {
      const response = await fetch("/api/certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(certificateData),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        alert(data.message); // Assuming the success message is in the response
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Failed to generate certificate.");
    }
  };

  return (
    <div className="w-full h-full mx-auto p-6 space-y-4 bg-white border-none rounded-lg flex justify-start items-start flex-col">
      {/* Header */}
      <div className="w-full h-20 flex justify-between items-center border-b pb-4">
        <h1 className="tracking-tight text-slate-800 text-2xl font-bold">
          Manage Certifications
        </h1>
      </div>

      {/* Form */}
      <div className="w-[400px] flex flex-col justify-start items-start bg-zinc-100 border-2 rounded-md p-4 space-y-4">
        {/* Name Field */}
        <div className="w-full">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mt-1 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email ID
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-1 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Donation ID Field (Read-only) */}
        <div>
          <label
            htmlFor="donationId"
            className="block text-sm font-medium text-gray-700"
          >
            Donation ID
          </label>
          <input
            type="text"
            id="donationId"
            value={donationId}
            readOnly
            className="w-full px-4 py-2 mt-1 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <Button
          className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 ease-in-out"
          onClick={handleGenerateCertificate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Certificate"}
        </Button>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${
              message.includes("successfully")
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
