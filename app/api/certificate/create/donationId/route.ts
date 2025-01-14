import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, donationId } = await request.json();

  try {
    if (!email || !donationId) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const ExistingCertificate = await prisma.certificates.findFirst({
      where: {
        donationId: donationId,
      },
    });

    if (!ExistingCertificate) {
      return NextResponse.json(
        { message: "Certificate Does Not Exist" },
        { status: 404 }
      );
    }
    console.log(ExistingCertificate);
    return NextResponse.json(
      {
        message: "Certificate Found",
        certificate: ExistingCertificate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
