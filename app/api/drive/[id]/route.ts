import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id?: string } }
) {
  if (!params || !params?.id) {
    return NextResponse.json(
      { error: "Drive ID is required" },
      { status: 400 }
    );
  }

  try {
    const drive = await prisma.drive.findUnique({
      where: {
        id: params?.id,
      },
    });

    if (!drive) {
      return NextResponse.json({ error: "Drive not found" }, { status: 404 });
    }

    return NextResponse.json(drive, { status: 200 });
  } catch (error) {
    console.error("Error fetching drive:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
