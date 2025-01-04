"use client";
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
}
