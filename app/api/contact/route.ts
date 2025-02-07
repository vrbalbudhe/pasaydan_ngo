import { prisma } from "@/prisma/client";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    fullname,
    email,
    message,
  }: { email: string; fullname: string; message: string } = await req.json();

  try {
    if (!email || !fullname || !message) {
      return NextResponse.json(
        { error: "Email, Full Name, and Message are required" },
        { status: 400 }
      );
    }

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
      subject: `Thank You For Contacting Us, ${fullname}`,
      html: `
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Us</title>
</head>
<body style="background-color: #f3f4f6; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Thank You for Reaching Out!</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 20px; color: #333;">
      <p>Dear ${fullname},</p>
      <p>Thank you for contacting us. We have received your message and appreciate you taking the time to reach out.</p>
      
      <!-- Message Details -->
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
        <p><strong>We have received the following details:</strong></p>
        <p>Name:    ${fullname}</p>
        <p>Email:   ${email}</p>
        <p>Message: ${message}</p>
      </div>
      
      <p>Our team will review your message and get back to you as soon as possible, usually within 24-48 business hours.</p>
      
      <!-- Next Steps -->
      <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px; color: #1e40af; margin-top: 15px;">
        <p><strong>What happens next?</strong></p>
        <ul>
          <li>Our team will carefully review your message.</li>
          <li>You'll receive a response from one of our team members.</li>
          <li>We may request additional information if needed.</li>
        </ul>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="border-top: 1px solid #e5e7eb; padding: 15px; text-align: center; font-size: 14px; color: #6b7280;">
      <p>Best regards,</p>
      <p><strong>Team Pasaydan</strong></p>
      <p>For urgent matters, please call us at: <span style="color: #2563eb;">1-800-XXX-XXXX</span></p>
      <p>Business Hours: Monday-Friday, 9 AM - 5 PM EST</p>
    </div>
  </div>
</body>
</html>

      `,
    };

    await transporter.sendMail(mailOptions);

    const sendContactUs = await prisma.contactUs.create({
      data: {
        fullname,
        email,
        message,
      },
    });

    if (!sendContactUs) {
      return NextResponse.json(
        { error: "Unable to create the contact us request" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Contact Us request sent and recorded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during contact request processing:", error);
    return NextResponse.json(
      { error: "Something went wrong while processing your request" },
      { status: 500 }
    );
  }
}
