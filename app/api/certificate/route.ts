import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";

interface CertificateRequestBody {
  userName: string;
  userEmail: string;
  donationId?: string;
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
  donationId: string
): Promise<string> => {
  try {
    // Get the absolute path to the certificate image
    const certificateImagePath = path.join(process.cwd(), 'public', 'PasaydanCertificates.jpg');
    
    // Read and encode the image
    const imageBuffer = await fs.readFile(certificateImagePath);
    const base64Image = imageBuffer.toString('base64');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
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
              top: 46%;
              left: 39%;
              font-size: 50px;
              color: black;
              font-family: 'Times New Roman', serif;
              font-weight: bold;
            }
            .donation-id {
              position: absolute;
              top: 53%;
              left: 39%;
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
              <div class="donation-id">Donation ID: ${donationId}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 842, height: 595 }); // A4 size in pixels

    const certificatesDir = path.join(process.cwd(), 'public', 'certificates');
    await fs.mkdir(certificatesDir, { recursive: true });

    const outputPath = path.join(certificatesDir, `${userName}-certificate.pdf`);
    await page.pdf({ 
      path: outputPath,
      format: 'A4',
      printBackground: true,
      landscape: true,
    });

    await browser.close();

    // Send email with the generated certificate
    await transporter.sendMail({
      from: process.env.EmailAddress,
      to: userEmail,
      subject: "Pasaydan Donation Certificate",
      text: `Dear ${userName},\n\nThank you for your donation (ID: ${donationId}). Please find your certificate attached.`,
      html: `<p>Dear ${userName},<br><br>Thank you for your donation (ID: ${donationId}). Please find your certificate attached.</p>`,
      attachments: [
        { 
          filename: `${userName}-certificate.pdf`,
          path: outputPath
        }
      ],
    });

    await fs.unlink(outputPath);
    console.log("Certificate sent and deleted after sending.");

    return outputPath;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
};

export async function POST(req: Request) {
  try {
    const { userName, userEmail, donationId }: CertificateRequestBody = await req.json();

    if (!userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const donationIdToUse = donationId || generateRandomDonationId();

    await generateCertificate(userName, userEmail, donationIdToUse);

    return NextResponse.json(
      { message: "Certificate generated and sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate." },
      { status: 500 }
    );
  }
}