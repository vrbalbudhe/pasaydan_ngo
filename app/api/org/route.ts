import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const GetAllOrgs = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        addressId: true,
        createdAt: true,
        otp: true,
        mobile: true,
        avatar: true,
        password: false,
        orgId: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(GetAllOrgs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong in the GET Organization route" },
      { status: 500 }
    );
  }
}
