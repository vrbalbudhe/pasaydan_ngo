import { prisma } from "@/prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      userType,
      email,
      password,
    }: { userType: string; email: string; password: string } = await req.json();

    if (!userType || !email || !password) {
      return NextResponse.json(
        { error: "User type, email, and password are required" },
        { status: 400 }
      );
    }

    const existingAccount =
      (await prisma.user.findFirst({ where: { email } })) ||
      (await prisma.organization.findFirst({ where: { email } }));

    if (existingAccount) {
      return NextResponse.json(
        { error: "Account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (userType === "organisation") {
      await prisma.organization.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
    }

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { error: "Something went wrong in the signup process" },
      { status: 500 }
    );
  }
}
