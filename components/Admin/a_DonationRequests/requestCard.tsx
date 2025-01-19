"use client";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";

type DonationDetails = {
  id: string;
  fullname: string;
  mobile: string;
  email: string;
  address: string;
  type: string;
  quantity: string;
  status: "Pending" | "Approved" | "Rejected";
};

interface DonationRequestCardProps extends DonationDetails {}

const statusStyles = {
  Pending: "text-yellow-800 bg-yellow-100 border border-yellow-200",
  Approved: "text-green-800 bg-green-100 border border-green-200",
  Rejected: "text-red-800 bg-red-100 border border-red-200",
};

async function updateDonationStatus(
  id: string,
  status: "Approved" | "Rejected"
) {
  try {
    const response = await fetch("/api/donation/request/reqApproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update donation request status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating donation request:", error);
    throw error;
  }
}

export default function DonationRequestCard({
  id,
  fullname,
  mobile,
  email,
  address,
  type,
  quantity,
  status,
}: DonationRequestCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateRandomDonationId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  const donationId = generateRandomDonationId();

  const handleApproval = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await updateDonationStatus(id, "Approved");
      const response2 = await fetch("/api/certificate/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: fullname,
          userEmail: email,
          donationId: donationId,
        }),
      });
      // userName, userEmail, donationId
      if (!response2.ok) {
        throw new Error("Failed to create certificate");
      }
      alert("Donation request approved successfully.");
      status = "Approved";
    } catch (error) {
      alert("Failed to approve donation request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejection = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await updateDonationStatus(id, "Rejected");
      alert("Donation request rejected successfully.");
      status = "Rejected";
    } catch (error) {
      alert("Failed to reject donation request.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-lg bg-white border border-gray-200 rounded-lg shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h5 className="text-xl font-bold tracking-tight text-gray-900">
            Donation Request
          </h5>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              statusStyles[status]
            }`}
          >
            {status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-sm text-gray-900">{fullname}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mobile</p>
              <p className="text-sm text-gray-900">{mobile}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-sm text-gray-900">{email}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="text-sm text-gray-900">{address}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Donation Type</p>
              <p className="text-sm text-gray-900">{type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Quantity</p>
              <p className="text-sm text-gray-900">{quantity}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <Button
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          onClick={handleApproval}
          disabled={
            isProcessing || status === "Approved" || status === "Rejected"
          }
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          onClick={handleRejection}
          disabled={
            isProcessing || status === "Approved" || status === "Rejected"
          }
        >
          <XCircle className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
