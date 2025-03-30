import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract form fields
    const fullname = formData.get("fullname") as string;
    const mobile = formData.get("mobile") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const type = formData.get("type") as string;
    const quantity = formData.get("quantity") as string;
    const photos = formData.getAll("photos") as File[];

    // Validation
    if (!email || !fullname || !mobile || !address || !type || !quantity) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json(
        { error: "Invalid mobile number format" },
        { status: 400 }
      );
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 }
      );
    }

    // Create donation request
    const donationRequest = await prisma.donationRequests.create({
      data: {
        fullname,
        mobile,
        email,
        address,
        type,
        quantity,
      },
    });

    // Handle file uploads
    const uploadedPhotos = [];
    for (const photo of photos) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const uniqueName = `${uuidv4()}-${photo.name}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", uniqueName);

      // Write file to filesystem
      await writeFile(uploadPath, buffer);

      // Create photo record in database
      const dbPhoto = await prisma.donorsPhoto.create({
        data: {
          url: `/uploads/${uniqueName}`,
          donationRequest: {
            connect: { id: donationRequest.id },
          },
        },
      });

      uploadedPhotos.push(dbPhoto.url);
    }

    // Send Telegram notification
    const message = `
      🎉 *Donation Request Created* 🎉
      
      👤 *Name:* ${fullname}
      📧 *Email:* ${email}
      📱 *Mobile:* ${mobile}
      🏠 *Address:* ${address}
      💖 *Donation Type:* ${type}
      📦 *Quantity:* ${quantity}
      🖼️ *Photos:* ${uploadedPhotos.length} uploaded
      🟢 *Status:* Pending
      📅 *Created At:* ${new Date().toLocaleString()}
      
      --------------------------------------
      `;

    await fetch("http://localhost:3000/api/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    return NextResponse.json(
      {
        message: "Donation Request Created successfully",
        donationId: donationRequest.id,
        photos: uploadedPhotos,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "Error during Creation of the donation Request:",
      error.message || error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
