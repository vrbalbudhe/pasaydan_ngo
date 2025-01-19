import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";

const BATCH_SIZE = 100;

interface DonationRequest {
  fullname: string;
  mobile: string;
  email: string;
  address: string;
  type: string;
  quantity: string;
}

export async function POST(req: Request) {
  try {
    const { donations } = (await req.json()) as { donations: DonationRequest[] };

    if (!Array.isArray(donations) || donations.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty donation requests data" },
        { status: 400 }
      );
    }

    // Process donations in batches
    const results = [];
    for (let i = 0; i < donations.length; i += BATCH_SIZE) {
      const batch = donations.slice(i, i + BATCH_SIZE);
      
      // Clean and validate each donation in the batch
      const cleanedBatch = batch.map(donation => ({
        fullname: donation.fullname.trim(),
        mobile: donation.mobile.trim(),
        email: donation.email.trim().toLowerCase(),
        address: donation.address.trim(),
        type: donation.type.trim(),
        quantity: donation.quantity.trim(),
        status: "Pending",
      }));

      // Use transaction for batch insertion
      const batchResults = await prisma.$transaction(
        cleanedBatch.map(donation =>
          prisma.donationRequests.create({
            data: donation,
          })
        )
      );

      results.push(...batchResults);
    }

    return NextResponse.json({
      message: `Successfully imported ${results.length} donation requests`,
      count: results.length,
    });
  } catch (error) {
    console.error("Error processing donation requests:", error);
    return NextResponse.json(
      { error: "Failed to process donation requests" },
      { status: 500 }
    );
  }
}