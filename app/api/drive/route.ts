import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const GetAllDrives = await prisma.drive.findMany();
    return NextResponse.json(GetAllDrives, { status: 200 });
  } catch (error) {
    console.error("Error fetching drives:", error);
    return NextResponse.json(
      { error: "Something went wrong in the GET Drives route" },
      { status: 500 }
    );
  }
}
