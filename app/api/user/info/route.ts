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
    });

    if (!user) {
      return NextResponse.json(
        { error: "No user found with the provided email" },
        { status: 404 }
      );
    }
    return NextResponse.json({ user }, { status: 200 });
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
