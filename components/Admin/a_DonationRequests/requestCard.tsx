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
  Pending: "text-slate-900 border border-yellow-200 bg-yellow-300",
  Approved: "text-green-500 bg-green-100",
  Rejected: "text-red-500 bg-red-100",
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

  const handleApproval = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await updateDonationStatus(id, "Approved");
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
    <Card
      className={cn(
        "w-[450px] shadow-lg border rounded-lg bg-white"
      )}
    >
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-blue-600">
            <span className="font-semibold text-gray-900">Full Name:</span>{" "}
            {fullname}
          </p>
          <p className="text-sm text-blue-600">
            <span className="font-semibold text-gray-900">Mobile:</span>{" "}
            {mobile}
          </p>
          <p className="text-sm text-blue-600">
            <span className="font-semibold text-gray-900">Email:</span> {email}
          </p>
          <p className="text-sm text-blue-600">
            <span className="font-semibold text-gray-900">Address:</span>{" "}
            {address}
          </p>
          <p className="text-sm text-blue-600">
            <span className="font-semibold text-gray-900">Donation Type:</span>{" "}
            {type}
          </p>
          <p className="text-sm text-blue-600">
            <span className="font-semibold text-gray-900">Quantity:</span>{" "}
            {quantity}
          </p>
          <p
            className={`text-sm font-semibold px-3 py-1 rounded-full w-fit ${
              statusStyles[status]
            }`}
          >
            {status}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4 p-4">
        <Button
          className="bg-green-500 text-white hover:bg-green-600 rounded-lg px-6 py-2"
          onClick={handleApproval}
          disabled={
            isProcessing || status === "Approved" || status === "Rejected"
          }
        >
          <CheckCircle className="mr-2" />
          Approve
        </Button>
        <Button
          className="bg-red-500 text-white hover:bg-red-600 rounded-lg px-6 py-2"
          onClick={handleRejection}
          disabled={
            isProcessing || status === "Approved" || status === "Rejected"
          }
        >
          <XCircle className="mr-2" />
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
