import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const GetAllCertificates = await prisma.certificates.findMany();
    return NextResponse.json(GetAllCertificates, { status: 200 });
  } catch (error) {
    console.error("Error fetching Certification details of the user:", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong in the GET Certification details of the user",
      },
      { status: 500 }
    );
  }
}
