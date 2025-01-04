import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

interface DonationRequestObj {
  id: string;
  status: "Pending" | "Approved" | "Rejected";
}

export async function POST(req: Request) {
  try {
    const { id, status }: DonationRequestObj = await req.json();
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const existingDonationRequest = await prisma.donationRequests.findUnique({
      where: {
        id,
      },
    });

    if (!existingDonationRequest) {
      return NextResponse.json(
        { error: "Donation request not found" },
        { status: 404 }
      );
    }

    const updatedDonationRequest = await prisma.donationRequests.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(
      {
        message: "Donation request updated successfully",
        updatedDonationRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during donation request update:", error);
    return NextResponse.json(
      { error: "Something went wrong in the POST Donation Request route" },
      { status: 500 }
    );
  }
}
