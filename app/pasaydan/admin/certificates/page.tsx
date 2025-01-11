"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Award, Copy, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const cert = `${process.env.BASE_URL || "http://localhost:3000"}/public/PasaydanCertificates.jpg`;
console.log("Certificate URL:", cert);
const generateRandomDonationId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export default function Certificates() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [donationId, setDonationId] = useState(generateRandomDonationId());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDonationId(generateRandomDonationId());
  }, []);

  const handleGenerateCertificate = async () => {
    if (!name || !email) {
      setMessage("Please fill out all required fields");
      return;
    }

    setLoading(true);
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

      if (response.ok) {
        setMessage(data.message);
        // Reset form after successful generation
        setName("");
        setEmail("");
        setDonationId(generateRandomDonationId());
      } else {
        setMessage(data.error || "Failed to generate certificate");
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      setMessage("Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  const copyDonationId = () => {
    navigator.clipboard.writeText(donationId);
    setMessage("Donation ID copied to clipboard!");
    setTimeout(() => setMessage(""), 2000);
  };

  const refreshDonationId = () => {
    setDonationId(generateRandomDonationId());
    setMessage("New Donation ID generated!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-start bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Certifications
          </h1>
        </div>
        <p className="text-gray-600 ml-11">
          Generate and manage donation certificates
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto">
        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Generate New Certificate
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder:text-gray-400"
                    placeholder="Enter recipient's name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder:text-gray-400"
                    placeholder="Enter recipient's email"
                  />
                </div>

                {/* Donation ID Field */}
                <div>
                  <label
                    htmlFor="donationId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Donation ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="donationId"
                      value={donationId}
                      readOnly
                      className="w-full px-4 py-2.5 pr-24 text-gray-900 bg-gray-50 border border-gray-200 
                               rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                               focus:border-transparent"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button
                        onClick={copyDonationId}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                        title="Copy ID"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={refreshDonationId}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                        title="Generate New ID"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Preview or Info */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">
                  Certificate Information
                </h3>
                <ul className="space-y-3 text-sm text-blue-800">
                  <li>• Certificate will be generated in PDF format</li>
                  <li>• An email will be sent to the provided address</li>
                  <li>• Keep the Donation ID for future reference</li>
                  <li>• Certificate can be downloaded immediately</li>
                </ul>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`mt-6 p-4 rounded-lg text-sm ${
                  message.includes("success") || message.includes("copied")
                    ? "bg-green-50 text-green-800 border border-green-100"
                    : "bg-red-50 text-red-800 border border-red-100"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                onClick={handleGenerateCertificate}
                disabled={loading}
                className="w-full sm:w-auto min-w-[200px] bg-black hover:bg-gray-700 text-white py-2.5 rounded-lg
                         transition-colors duration-200 disabled:bg-blue-400"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </span>
                ) : (
                  "Generate Certificate"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* <img
          src="https://drive.google.com/uc?export=view&id=18g_jreJ_pazXvx5W7N2AmZ9Mim93Y42i"
          alt="Certificate"
        /> */}
      </div>
    </div>
  );
}

{
  /*"use client";
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
      {/* Header */
}
{
  /*     <div className="w-full h-20 flex justify-between items-center border-b pb-4">
        <h1 className="tracking-tight text-slate-800 text-2xl font-bold">
          Manage Certifications
        </h1>
      </div>

      {/* Form */
}
{
  /*     <div className="w-[400px] flex flex-col justify-start items-start bg-zinc-100 border-2 rounded-md p-4 space-y-4">
        {/* Name Field */
}
{
  /*        <div className="w-full">
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

        {/* Email Field */
}
{
  /*        <div>
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

        {/* Donation ID Field (Read-only) */
}
{
  /*        <div>
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

        {/* Button */
}
{
  /*        <Button
          className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 ease-in-out"
          onClick={handleGenerateCertificate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Certificate"}
        </Button>

        {/* Message */
}
{
  /*}        {message && (
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
} */
}
