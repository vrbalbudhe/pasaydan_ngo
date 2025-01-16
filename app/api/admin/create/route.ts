import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, role, email, password, mobile } = await req.json();

    if (!name || !role || !email || !password || !mobile) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser =
      (await prisma.admin.findUnique({ where: { email } })) ||
      (await prisma.subAdmins.findUnique({ where: { email } }));

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const data = {
      email,
      password: hashedPassword,
      role,
      name,
      mobile,
    };

    if (role.toLowerCase() === "admin") {
      await prisma.admin.create({ data });
    } else if (role.toLowerCase() === "miniadmin") {
      await prisma.subAdmins.create({ data });
    } else {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Account Created Successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during Admin signup:", error);
    return NextResponse.json(
      { error: "Something went wrong in the signup process" },
      { status: 500 }
    );
  }
}
