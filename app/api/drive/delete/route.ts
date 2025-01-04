import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  try {
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing drive ID" },
        { status: 400 }
      );
    }
    const deletedDrive = await prisma.drive.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Drive deleted successfully",
      drive: deletedDrive,
    });
  } catch (error: any) {
    console.error("Error deleting drive:", error);
    return NextResponse.json(
      { message: "Failed to delete drive", error: error.message },
      { status: 500 }
    );
  }
}
