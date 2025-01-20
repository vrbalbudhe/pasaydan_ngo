import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return new Response("File not specified", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "certificates", fileName);

  try {
    const file = await fs.readFile(filePath);
    return new Response(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error serving certificate:", error);
    return new Response("File not found", { status: 404 });
  }
}
