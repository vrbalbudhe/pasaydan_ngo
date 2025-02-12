import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, contact, school, standard, area, photos } = body;

    if (!fullName || !contact || !school || !standard || !area) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    // Create participant with associated photos
    const participant = await prisma.participant.create({
      data: {
        fullName,
        contact,
        school,
        standard,
        area,
        photos: {
          create: photos?.map((photoUrl: string) => ({
            url: photoUrl,
          })),
        },
      },
      include: { photos: true },
    });

    return NextResponse.json(
      { message: "Participant added!", participant },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding participant:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
