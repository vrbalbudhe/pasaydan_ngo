import { prisma } from "@/prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const uploadDir = path.join("public", "uploads");

export async function POST(request: NextRequest) {
  try {
    await mkdir(uploadDir, { recursive: true });
    const data = await request.formData();

    // Get the files and other form data fields
    const files = data.getAll("file") as File[];
    const title = (data.get("title") as string | null) || ""; // Default to empty string if null
    const location = (data.get("location") as string | null) || "";
    const description = (data.get("description") as string | null) || "";
    const dtype = (data.get("dtype") as string | null) || "";
    const startDate = (data.get("startDate") as string | null) || "";
    const EndDate = (data.get("EndDate") as string | null) || "";
    const timeInterval = (data.get("timeInterval") as string | null) || "";
    console.log(title);
    console.log(location);
    console.log(description);
    console.log(dtype);
    const photoPaths: string[] = [];

    // Process each file and save it
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(uploadDir, file.name);
      await writeFile(filePath, buffer);
      console.log(`File uploaded successfully: ${path}`);
      photoPaths.push(filePath); // Add the path to the array
    }

    // Create a new Drive entry in the database
    const newDrive = await prisma.drive.create({
      data: {
        title,
        location,
        description,
        dtype,
        startDate,
        EndDate,
        timeInterval,
        photos: photoPaths,
      },
    });

    // Respond with the new drive information
    return NextResponse.json(newDrive, { status: 201 });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "Something went wrong in the POST route" },
      { status: 500 }
    );
  }
}
