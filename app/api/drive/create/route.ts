import { prisma } from "@/prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  const {
    title,
    location,
    description,
    status,
    dtype,
    startDate,
    EndDate,
    timeInterval,
    placeLink,
    latitude,
    longitude,
    files,
  } = await request.json();

  try {
    await mkdir(uploadDir, { recursive: true });

    const uploadedFilePaths: string[] = [];
    if (files && Array.isArray(files)) {
      for (const file of files) {
        const buffer = Buffer.from(file.data);
        const filePath = path.join(uploadDir, file.name);
        await writeFile(filePath, buffer);
        uploadedFilePaths.push(`/uploads/${file.name}`);
      }
    }

    const drive = await prisma.drive.create({
      data: {
        title,
        location,
        description,
        status,
        dtype,
        startDate,
        EndDate,
        timeInterval,
        geoLocation:
          latitude && longitude ? { latitude, longitude } : undefined,
        placeLink: placeLink || undefined,
        photos: uploadedFilePaths,
      },
    });
    console.log(drive);

    return NextResponse.json({ success: true, drive });
  } catch (error) {
    console.error("Error creating drive:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create drive" },
      { status: 500 }
    );
  }
}
