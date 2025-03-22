import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all users for the calendar
export async function GET(request: NextRequest) {
  try {
    // Fetch all users - we'll display everyone regardless of user type
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
      },
      orderBy: {
        fullname: 'asc', // Sort alphabetically
      },
    });

    // Format for frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      fullname: user.fullname || user.email.split('@')[0], // Use email if no fullname
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}