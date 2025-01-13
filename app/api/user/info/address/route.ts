import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { addressId } = await req.json();

    if (!addressId) {
      return NextResponse.json(
        { error: `Please provide the addressId.` },
        { status: 400 }
      );
    }

    const addressInformation = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!addressInformation) {
      return NextResponse.json(
        { error: `No information found with this address ID: ${addressId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Address information fetched successfully",
        address: addressInformation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/user/info/address:", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong while fetching user address information using the address ID. Please try again later.",
      },
      { status: 500 }
    );
  }
}
