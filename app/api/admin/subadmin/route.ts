import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const GetAllSubAdmins = await prisma.subAdmins.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        mobile: true,
        password: false,
      },
    });
    return NextResponse.json(GetAllSubAdmins, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong in the GET Organization route" },
      { status: 500 }
    );
  }
}
