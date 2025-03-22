import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public/uploads");

async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Error creating upload directory:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureUploadDir();

    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const fields = [
      "fullName",
      "contact",
      "school",
      "standard",
      "area",
      "driveId",
    ];
    const participantData = Object.fromEntries(
      fields.map((field) => [
        field,
        formData.get(field)?.toString().trim() || "",
      ])
    );

    if (Object.values(participantData).some((value) => !value)) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    if (
      !participantData.driveId ||
      !ObjectId.isValid(participantData.driveId)
    ) {
      return NextResponse.json(
        { message: "Invalid driveId format" },
        { status: 400 }
      );
    }

    const files = formData.getAll("photos") as File[];
    const fileUrls: string[] = [];

    for (const file of files) {
      if (file instanceof Blob) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `photo-${Date.now()}-${Math.random().toString(36).substring(2, 10)}${path.extname(file.name) || ".jpg"}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);
        fileUrls.push(`/uploads/${fileName}`);
      }
    }

    const participant = await prisma.participant.create({
      data: {
        fullName: participantData.fullName,
        contact: participantData.contact,
        school: participantData.school,
        standard: participantData.standard,
        area: participantData.area,
        drive: { connect: { id: participantData.driveId } },
        photos: { create: fileUrls.map((url) => ({ url: url || "" })) },
      },
      include: { photos: true },
    });

    return NextResponse.json(
      { message: "Participant added successfully!", participant },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding participant:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

export const config = { api: { bodyParser: false } };
