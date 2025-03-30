import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const GetAllDonationRequests = await prisma.donationRequests.findMany();
    return NextResponse.json(GetAllDonationRequests, { status: 200 });
  } catch (error) {
    // console.error("Error fetching Donation Requests:", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong in the GET fetching Donation Requests route",
      },
      { status: 500 }
    );
  }
}
