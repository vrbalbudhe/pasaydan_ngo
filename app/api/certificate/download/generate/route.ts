// app/api/certificate/download/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const { userName, userEmail, donationId, type } = await request.json();

    // First, generate the certificate using the existing route
    const generateResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/certificate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, userEmail, donationId, type }),
    });

    if (!generateResponse.ok) {
      throw new Error('Failed to generate certificate');
    }

    const { certificateUrl } = await generateResponse.json();

    // Read the generated certificate
    const filePath = path.join(process.cwd(), 'public', certificateUrl);
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${userName}-certificate.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error handling certificate download:", error);
    return NextResponse.json(
      { error: "Failed to download certificate" },
      { status: 500 }
    );
  }
}