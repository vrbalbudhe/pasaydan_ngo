import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/client";

const NewPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = NewPasswordSchema.parse(body);
  try {
    if (!password || !email) {
      return NextResponse.json(
        {
          message: "Please Enter the email and Password field",
          success: "false",
        },
        { status: 401 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User With this Email does not exist.",
          success: "false",
        },
        { status: 404 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        otp: null,
        password: hashPassword,
      },
    });

    return NextResponse.json({
      message: "Password Changed successfully!",
      success: "true",
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error sending OTP", error: error.message },
      { status: 500 }
    );
  }
}
