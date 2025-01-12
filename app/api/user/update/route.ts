import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const uploadDir = path.join("public", "uploads", "avatars");

export async function POST(request: Request) {
  try {
    await mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();
    const fullname = formData.get("fullname")?.toString();
    const email = formData.get("email")?.toString();
    const mobile = formData.get("mobile")?.toString();

    const streetAddress = formData.get("streetAddress")?.toString();
    const addressLine2 = formData.get("addressLine2")?.toString();
    const city = formData.get("city")?.toString();
    const state = formData.get("state")?.toString();
    const postalCode = formData.get("postalCode")?.toString();
    const country = formData.get("country")?.toString();

    const avatar = formData.get("avatar");

    let avatarPath: string | undefined;
    if (avatar && avatar instanceof Blob) {
      const avatarBuffer = Buffer.from(await avatar.arrayBuffer());
      const avatarFilePath = path.join(uploadDir, avatar.name);
      await writeFile(avatarFilePath, avatarBuffer);
      avatarPath = `/uploads/avatars/${avatar.name}`;
    }

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    let addressId = existingUser.addressId;

    if (streetAddress && city && state && postalCode && country) {
      const addressData = {
        streetAddress,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      };

      if (addressId) {
        // Update the existing address
        const updatedAddress = await prisma.address.update({
          where: { id: addressId },
          data: addressData,
        });
        addressId = updatedAddress.id;
      } else {
        // Create a new address
        const newAddress = await prisma.address.create({
          data: addressData,
        });
        addressId = newAddress.id;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        fullname,
        mobile,
        avatar: avatarPath,
        addressId,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
