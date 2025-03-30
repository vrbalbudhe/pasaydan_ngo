import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate the ID format
    if (!id) {
      return NextResponse.json(
        { message: "Invalid Drive ID" },
        { status: 400 }
      );
    }

    // Query participants and their photos with correct ID handling
    const participants = await prisma.participant.findMany({
      where: { driveId: id },
      select: {
        photos: {
          select: {
            id: true, 
            url: true,
          },
        },
      },
    });

    // Extract photo objects with id and url
    const images = participants.flatMap((participant) =>
      participant.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
      }))
    );

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
