// app/api/certificate/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";

interface CertificateRequestBody {
  userName: string;
  userEmail: string;
  donationId?: string;
  type: string;
  downloadOnly?: boolean;
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EmailAddress,
    pass: process.env.EmailPassword,
  },
});

const generateRandomDonationId = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const generateCertificate = async (
  userName: string,
  userEmail: string,
  donationId: string,
  type: string
): Promise<string> => {
  try {
    console.log("Generating certificate for:", userName, userEmail, donationId);

    const certificateImagePath = path.join(
      process.cwd(),
      "public",
      "PasaydanCertificates.jpg"
    );

    const imageBuffer = await fs.readFile(certificateImagePath);
    const base64Image = imageBuffer.toString("base64");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f3f3f3;
            }
            .certificate {
              position: relative;
              width: 100%;
              height: 100vh;
            }
            .certificate-bg {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
            }
            .content {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 2;
              width: 100%;
              height: 100%;
            }
            .name {
              position: absolute;
              top: 45%;
              left: 20%;
              font-size: 40px;
              color: black;
              font-family: 'Times New Roman', serif;
              font-weight: bold;
              width: 60%;
              text-align: center;
            }
            .donation-id {
              position: absolute;
              top: 61%;
              left: 35%;
              font-size: 25px;
              color: black;
              font-family: 'Arial', sans-serif;
              font-weight: bold;
            }
            .type-id {
              position: absolute;
              top: 56%;
              left: 58%;
              font-size: 25px;
              color: black;
              font-family: 'Arial', sans-serif;
              font-weight: bold;
            }
            .date {
              position: absolute;
              bottom: 1%;
              left: 43%;
              font-size: 20px;
              color: black;
              font-family: 'Arial', sans-serif;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <img 
              src="data:image/jpeg;base64,${base64Image}" 
              class="certificate-bg"
            />
            <div class="content">
              <div class="name">${userName}</div>
              <div class="donation-id">${donationId}</div>
              <div class="type-id">${type}</div>
              <div class="date">${new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.setViewport({ width: 1200, height: 850 });

    const certificatesDir = path.join(process.cwd(), "public", "certificates");
    await fs.mkdir(certificatesDir, { recursive: true });

    const fileName = `${userName}-${donationId}-certificate.pdf`;
    const outputPath = path.join(certificatesDir, fileName);
    
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      landscape: true,
    });

    await browser.close();

    console.log("Certificate generated at:", outputPath);
    return `/certificates/${fileName}`;
  } catch (error) {
    console.error("Error in certificate generation:", error);
    throw error;
  }
};

const sendCertificateEmail = async (
  userName: string,
  userEmail: string,
  donationId: string,
  certificatePath: string
) => {
  const fullPath = path.join(process.cwd(), "public", certificatePath);
  
  await transporter.sendMail({
    from: process.env.EmailAddress,
    to: userEmail,
    subject: "Pasaydan Donation Certificate",
    text: `Dear ${userName},\n\nThank you for your donation (ID: ${donationId}). Please find your certificate attached.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank You for Your Donation</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for your generous donation (ID: ${donationId}). Your support means a lot to us.</p>
        <p>Please find your certificate attached to this email.</p>
        <p>Best regards,<br>Team Pasaydan</p>
      </div>
    `,
    attachments: [
      {
        filename: `${userName}-certificate.pdf`,
        path: fullPath,
      },
    ],
  });
};

export async function POST(req: Request) {
  try {
    const { userName, userEmail, donationId, type, downloadOnly }: CertificateRequestBody =
      await req.json();

    if (!userName) {
      return NextResponse.json(
        { error: "User name is required." },
        { status: 400 }
      );
    }

    const donationIdToUse = donationId || generateRandomDonationId();
    
    // Generate certificate and get its URL
    const certificateUrl = await generateCertificate(
      userName,
      userEmail,
      donationIdToUse,
      type
    );

    // Send email if not download-only and email is provided
    if (!downloadOnly && userEmail) {
      try {
        await sendCertificateEmail(
          userName,
          userEmail,
          donationIdToUse,
          certificateUrl
        );
        console.log("Certificate email sent successfully");
      } catch (emailError) {
        console.error("Error sending certificate email:", emailError);
        // Continue execution even if email fails
      }
    }

    return NextResponse.json(
      {
        message: downloadOnly 
          ? "Certificate generated successfully." 
          : "Certificate generated and sent successfully.",
        certificateUrl,
        donationId: donationIdToUse
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in certificate generation/sending:", error);
    return NextResponse.json(
      { error: "Failed to process certificate request." },
      { status: 500 }
    );
  }
}