import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { prisma } from "@/prisma/client";

const EmailSchema = z.object({
  otp: z.string(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const { email, otp } = EmailSchema.parse(body);
    if (!otp || !email) {
      return NextResponse.json(
        {
          message: "All fields are required.",
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

    const checkOTP = existingUser?.otp === otp ? "true" : "false";
    if (!checkOTP) {
      return NextResponse.json(
        {
          message: "OTP Does not matches.",
          success: "false",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "OTP Verified Successfully",
      success: "true",
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error During OTP Verification", error: error.message },
      { status: 500 }
    );
  }
}
