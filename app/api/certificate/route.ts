import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import { readFileSync } from "fs";

// Define the base64-encoded image data (replace with actual base64 string)
const certificateImageBase64 = readFileSync(
  path.join(process.cwd(), "public", "PasaydanCertificates.jpg"),
  "base64"
);
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
    const htmlContent = `
      <html>
        <head>
          <style>
            .certificate {
              background-image: url('data:image/jpeg;base64,${certificateImageBase64}'); /* Base64 encoded image */
              background-size: cover;
              background-position: center;
              width: 595px;
              height: 842px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              color: black;
              font-family: Arial, sans-serif;
              text-align: center;
            }
            .name {
              font-size: 35px;
              margin-top: 100px;
            }
            .donation-id {
              font-size: 20px;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="name">${userName}</div>
            <div class="donation-id">Donation ID: ${donationId}</div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.setViewport({ width: 595, height: 842 });

    const certificatesDir = path.join(process.cwd(), "public", "certificates");
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir);
    }

    const outputPath = path.join(
      certificatesDir,
      `${userName}-certificate.pdf`
    );
    await page.pdf({ path: outputPath, format: "A4" });

    await browser.close();

    // Send email with the generated certificate
    const subject = "Pasaydan Donation Certificate";
    const text = `Dear ${userName},\n\nThank you for your donation (ID: ${donationId}). Please find your certificate attached.`;
    const html = `<p>Dear ${userName},<br><br>Thank you for your donation (ID: ${donationId}). Please find your certificate attached.</p>`;

    await transporter.sendMail({
      from: process.env.EmailAddress,
      to: userEmail,
      subject,
      text,
      html,
      attachments: [
        { filename: `${userName}-certificate.pdf`, path: outputPath },
      ],
    });

    fs.unlinkSync(outputPath);
    console.log("Certificate sent and deleted after sending.");

    return outputPath;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
};

export const POST = async (req: Request) => {
  const { userName, userEmail, donationId }: CertificateRequestBody =
    await req.json();

  try {
    if (!userName || !userEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400 }
      );
    }

    const donationIdToUse = donationId || generateRandomDonationId();

    await generateCertificate(userName, userEmail, donationIdToUse);

    return new Response(
      JSON.stringify({
        message: "Certificate generated and sent successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API handler:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate certificate." }),
      { status: 500 }
    );
  }
};
