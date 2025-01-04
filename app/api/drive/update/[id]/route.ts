import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  try {
    const updatedDrive = await prisma.drive.update({
      where: { id },
      data: {
        title: body.title,
        location: body.location,
        description: body.description,
        startDate: body.startDate,
        EndDate: body.EndDate,
        timeInterval: body.timeInterval,
        status: body.status,
        dtype: body.dtype,
        photos: body.photos || [],
      },
    });
    return NextResponse.json({
      message: "Drive updated successfully",
      drive: updatedDrive,
    });
  } catch (error) {
    console.error("Error updating drive:", error);
    return NextResponse.json(
      { message: "Error updating drive" },
      { status: 500 }
    );
  }
}
