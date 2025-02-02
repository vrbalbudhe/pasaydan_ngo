// app/api/admin/dashboard/drives/route.ts
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const drives = await prisma.drive.findMany({
      orderBy: {
        startDate: 'asc'
      }
    });
    
    return NextResponse.json(drives, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching drives data" },
      { status: 500 }
    );
  }
}