// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
      },
      orderBy: {
        fullname: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}