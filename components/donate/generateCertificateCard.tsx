"use client";
import React, { useState } from "react";
import { Download, FileCheck } from "lucide-react";
import { Data } from "@react-google-maps/api";

export default function CertificateForm() {
  const [donationId, setDonationId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!donationId || !email) {
      setMessage("Please fill in both fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/certificate/create/donationId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ donationId: donationId, email: email }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the certificate. Please try again.");
      }
      const data = await response.json();
      if (response.ok) {
        const response1 = await fetch("/api/certificate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: data?.certificate?.fullname,
            userEmail: email,
            donationId: donationId,
          }),
        });
        if (response1) {
          setMessage("Certificate downloaded successfully!");
        } else {
          setMessage("Unable to Generate Certificate!");
        }
      }
    } catch (error: any) {
      setMessage(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-fit w-full flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <FileCheck className="text-black w-12 h-12" />{" "}
            <h2 className="text-2xl font-bold text-gray-800 ml-3">
              Download Certificate
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="donationId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Certificate Donation ID
              </label>
              <input
                id="donationId"
                type="text"
                value={donationId}
                onChange={(e) => setDonationId(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your certificate ID"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 px-6 rounded-md transition duration-200 flex items-center justify-center space-x-2 group ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
                  <span>Download Certificate</span>
                </>
              )}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-sm text-center ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-4 text-sm text-gray-600 text-center">
            Please enter the certificate ID provided in your email
          </p>
        </div>
      </div>
    </div>
  );
}
