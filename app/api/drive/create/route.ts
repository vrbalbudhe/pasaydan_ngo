// app/api/drive/create/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Validate file type
function isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(file.type);
}

// Helper to handle multipart form data
async function saveFile(file: File, fileName: string): Promise<string> {
    // Validate file type
    if (!isValidFileType(file)) {
        throw new Error(`Invalid file type: ${file.type}. Allowed types: jpeg, png, gif, webp`);
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        throw new Error(`File size exceeds limit of 5MB`);
    }
    const uploadDir = path.join(process.cwd(), "public", "uploads", "Drive_images");
    
    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });
    
    // Generate unique filename to prevent overwrites
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Return the relative path for database storage
    return `/uploads/Drive_images/${uniqueFileName}`;
}

export async function POST(request: Request) {
  try {
      const formData = await request.formData();
      
      // Extract files
      const files = formData.getAll('photos') as File[];
      
      // Handle file uploads
      const uploadedPaths: string[] = [];
      if (files.length > 0) {
          if (files.length > 10) {
              return NextResponse.json(
                  { success: false, message: "Maximum 10 images allowed" },
                  { status: 400 }
              );
          }

          for (const file of files) {
              if (file instanceof File) {
                  const filePath = await saveFile(file, file.name);
                  uploadedPaths.push(filePath);
              }
          }
      }

      // Create the base data object with required fields
      const driveData = {
          title: formData.get('title') as string,
          location: formData.get('location') as string,
          description: formData.get('description') as string,
          status: (formData.get('status') as string) || "pending",
          dtype: formData.get('dtype') as string,
          startDate: formData.get('startDate') as string,
          EndDate: formData.get('EndDate') as string,
          timeInterval: formData.get('timeInterval') as string,
          photos: uploadedPaths,
      };

      // Handle optional geoLocation
      const latitude = formData.get('latitude');
      const longitude = formData.get('longitude');
      if (latitude && longitude) {
          driveData['geoLocation'] = {
              latitude: String(latitude),
              longitude: String(longitude)
          };
      }

      // Create drive in database - explicitly type the data
      const drive = await prisma.drive.create({
          data: driveData
      });

      return NextResponse.json({
          success: true,
          drive,
          message: "Drive created successfully"
      });

  } catch (error) {
      console.error("Error creating drive:", error);
      return NextResponse.json(
          { 
              success: false, 
              message: error instanceof Error ? error.message : "Failed to create drive"
          },
          { status: 500 }
      );
  }
}

export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
    },
};