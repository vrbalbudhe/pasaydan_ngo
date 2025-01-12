import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid or missing email" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        password: false,
        id: true,
        userType: true,
        fullname: true,
        email: true,
        address: true,
        addressId: true,
        avatar: true,
        mobile: true,
        createdAt: true,
        organizationId: true,
      },
    });

    const org = await prisma.organization.findUnique({
      where: { email },
      select: {
        password: false,
        id: true,
        orgId: true,
        name: true,
        email: true,
        contactPerson: true,
        address: true,
        addressId: true,
        avatar: true,
        mobile: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user && !org) {
      return NextResponse.json(
        { error: "No user or organization found with the provided email" },
        { status: 404 }
      );
    }

    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    }

    if (org) {
      return NextResponse.json({ org }, { status: 200 });
    }
  } catch (error) {
    console.error("Error in /api/user/details:", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong in the userAllInformation Using Email-Id. Please try again later.",
      },
      { status: 500 }
    );
  }
}
