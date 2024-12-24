import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const GetAllUsers = await prisma.user.findMany();
    return NextResponse.json(GetAllUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong in the GET User route" },
      { status: 500 }
    );
  }
}
