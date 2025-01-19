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

    const deletedUserCertificate = await prisma.certificates.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: `Certification {${id}} deleted successfully.`,
        deletedUserCertificatesDetails: deletedUserCertificate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting certification details:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the certificates." },
      { status: 500 }
    );
  }
}
