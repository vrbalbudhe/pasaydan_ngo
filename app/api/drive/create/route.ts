import { prisma } from "@/prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const uploadDir = path.join("public", "uploads");

export async function POST(request: NextRequest) {
  try {
    await mkdir(uploadDir, { recursive: true });
    const data = await request.formData();

    const files = data.getAll("file") as File[];
    const title = (data.get("title") as string | null) || "";
    const location = (data.get("location") as string | null) || "";
    const description = (data.get("description") as string | null) || "";
    const dtype = (data.get("dtype") as string | null) || "";
    const startDate = (data.get("startDate") as string | null) || "";
    const EndDate = (data.get("EndDate") as string | null) || "";
    const timeInterval = (data.get("timeInterval") as string | null) || "";
    const status = (data.get("status") as string | null) || "";
    const photoPaths: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, file.name);
      await writeFile(filePath, buffer);
      console.log(`File uploaded successfully: ${path}`);
      photoPaths.push(filePath);
    }

    const newDrive = await prisma.drive.create({
      data: {
        title,
        location,
        description,
        dtype,
        startDate,
        status,
        EndDate,
        timeInterval,
        photos: photoPaths,
      },
    });

    return NextResponse.json(newDrive, { status: 201 });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "Something went wrong in the POST route" },
      { status: 500 }
    );
  }
}
