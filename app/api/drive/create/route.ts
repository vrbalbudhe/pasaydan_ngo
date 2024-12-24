import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      location,
      description,
      dtype,
      startDate,
      EndDate,
      timeInterval,
    } = await request.json();
    // if (
    //   !title ||
    //   !location ||
    //   !description ||
    //   !dtype ||
    //   !startDate ||
    //   !endDate ||
    //   !timeInterval
    // ) {
    //   return NextResponse.json(
    //     { error: "All fields are required" },
    //     { status: 400 }
    //   );
    // }

    const newDrive = await prisma.drive.create({
      data: {
        title,
        location,
        description,
        dtype,
        startDate,
        EndDate,
        timeInterval,
      },
    });

    return NextResponse.json(newDrive, { status: 201 });
  } catch (error) {
    console.error("Error creating drive:", error);
    return NextResponse.json(
      { error: "Something went wrong in the POST Drives route" },
      { status: 500 }
    );
  }
}
