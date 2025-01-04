import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      fullname,
      mobile,
      email,
      address,
      type,
      quantity,
    }: {
      fullname: string;
      mobile: string;
      email: string;
      address: string;
      type: string;
      quantity: string;
    } = await req.json();

    if (!email || !fullname || !mobile || !address || !type || !quantity) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json(
        { error: "Invalid mobile number format" },
        { status: 400 }
      );
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 }
      );
    }

    const createDonationRequest = await prisma.donationRequests.create({
      data: {
        fullname,
        mobile,
        email,
        address,
        type,
        quantity,
      },
    });

    return NextResponse.json(
      { message: "Donation Request Created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "Error during Creation of the donation Request:",
      error.message || error
    );
    return NextResponse.json(
      { error: "Something went wrong in the POST Donation Creation route" },
      { status: 500 }
    );
  }
}
