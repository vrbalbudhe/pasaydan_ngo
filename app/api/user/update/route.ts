import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const uploadDir = path.join("public", "uploads", "avatars");

export async function POST(request: Request) {
  try {
    await mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();
    const fullname = formData.get("fullname")
      ? String(formData.get("fullname"))
      : undefined;
    const email = formData.get("email")
      ? String(formData.get("email"))
      : undefined;
    const address = formData.get("address")
      ? String(formData.get("address"))
      : undefined;
    const mobile = formData.get("mobile")
      ? String(formData.get("mobile"))
      : undefined;

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

    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        fullname: fullname,
        address: address,
        mobile: mobile,
        avatar: avatarPath,
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
