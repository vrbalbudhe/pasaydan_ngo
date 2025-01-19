import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const deletedOrg = await prisma.organization.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Organisation deleted successfully.", org: deletedOrg },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Organisation:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the Organisation." },
      { status: 500 }
    );
  }
}
