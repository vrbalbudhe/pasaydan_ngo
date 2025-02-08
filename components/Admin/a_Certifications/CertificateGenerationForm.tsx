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

export default function CertificateGenerationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [certificateUrl, setCertificateUrl] = useState("");
  const [type, setType] = useState("");
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");
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
    const certificateData = {
      userName: name,
      userEmail: email,
      donationId,
      type: type,
    };

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
        setCertificateUrl(data.certificateUrl);
        setMessage(data.message);
      } else {
        setMessage(data.error || "Failed to generate certificate");
      }

      if (response.ok) {
        const response1 = await fetch("/api/certificate/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            type: type,
            fullname: name,
            mobile: mobile,
            description: description,
            donationId: donationId,
          }),
        });
        if (!response1) {
          alert("Unable to Generate Certificate");
        }
        if (response1) {
          alert("Certificate Generated and Updated");
        }
        setMessage(data.message);
        setName("");
        setEmail("");
        setDescription("");
        setType("");
        setMobile("");
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
    <div className="min-h-screen md:w-full w-fit flex flex-col justify-start items-start bg-gray-50 md:p-6">
      {/* Header Section */}
      <div className="w-full pl-5 md:pl-0 h-fit md:mx-auto mb-8">
        
        {/* <p className="text-gray-600 min-h-fit text-wrap ml-11">
          Generate and manage donation certificates
        </p> */}
      </div>

      {/* Main Content */}
      <div className="md:w-full w-full pr-2 md:pr-0 flex justify-center pl-2 md:pl-0 items-start mx-auto">
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
                    id="fullname"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder:text-gray-400"
                    placeholder="Enter recipient's name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded-lg 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
             placeholder:text-gray-400"
                  >
                    <option value="" disabled>
                      Select a type
                    </option>
                    <option value="Money">Money Donation</option>
                    <option value="Cycle">Cycle Donation</option>
                    <option value="Blanket">Blanket Donation</option>
                    <option value="Food">Food Donation</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
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
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
              {certificateUrl && (
                <div className="mt-4">
                  <a
                    href={certificateUrl}
                    download
                    className="text-blue-500 underline"
                  >
                    Click here to download your certificate
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
