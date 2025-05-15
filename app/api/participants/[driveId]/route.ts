import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { driveId: string } }
) {
  try {
    const { driveId } = params;
    console.log(driveId)
    

    // Validate the driveId
    if (!driveId) {
      return NextResponse.json(
        { message: "Drive ID is required" },
        { status: 400 }
      );
    }

    // Fetch all participants for the given drive
    const participants = await prisma.participant.findMany({
      where: {
        driveId: driveId,
      },
      include: {
        photos: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    // Format the response to match the component's expected structure
    const formattedParticipants = participants.map((participant) => ({
      id: participant.id,
      fullName: participant.fullName,
      contact: participant.contact,
      school: participant.school,
      standard: participant.standard,
      area: participant.area,
      createdAt: participant.createdAt.toISOString(),
      driveId: participant.driveId || "",
      // Only include photos if you need them in the participants list component
      photoCount: participant.photos.length,
    }));

    return NextResponse.json(formattedParticipants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
