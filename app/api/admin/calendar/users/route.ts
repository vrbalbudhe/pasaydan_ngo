import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Fetch individual users
    const individualUsers = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
      },
      where: {
        fullname: {
          not: null,
        },
      },
      orderBy: {
        fullname: 'asc',
      },
    });

    // Fetch organization users
    const organizationUsers = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        name: {
          not: null,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Combine and format both user types
    const users = [
      ...individualUsers.map(user => ({
        id: user.id,
        fullname: user.fullname || user.email.split('@')[0],
        email: user.email,
        type: 'individual',
      })),
      ...organizationUsers.map(org => ({
        id: org.id,
        fullname: org.name || org.email.split('@')[0],
        email: org.email,
        type: 'organization',
      })),
    ].sort((a, b) => a.fullname.localeCompare(b.fullname));

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 });
  }
}