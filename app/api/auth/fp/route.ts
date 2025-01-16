import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { prisma } from "@/prisma/client";

const EmailSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = EmailSchema.parse(body);
  try {
    if (!email) {
      return NextResponse.json(
        {
          message: "Please Enter the Email",
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

    const otp = Math.floor(100000 + Math.random() * 900000);

    await prisma.user.update({
      where: { email: email },
      data: { otp: otp.toString() },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
      logger: true,
      debug: true,
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Forgot Password OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "OTP sent successfully!",
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
