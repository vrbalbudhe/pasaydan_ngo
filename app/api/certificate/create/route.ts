import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, type, fullname, mobile, description, donationId } =
    await request.json();
  try {
    if (!email || !type || !fullname || !mobile || !donationId) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const newRecord = {
      email,
      type,
      fullname,
      mobile,
      donationId,
      description,
    };
    console.log(newRecord);
    const certificateData = await prisma.certificates.create({
      data: newRecord,
    });
    if (certificateData) {
      return NextResponse.json(
        { message: "Data received successfully", data: certificateData },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
