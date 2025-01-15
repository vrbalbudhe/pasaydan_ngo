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
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Extract files
    const files = formData.getAll('photos') as File[];
    
    // Handle file uploads
    const uploadedPaths: string[] = [];
    if (files.length > 0) {
      // Limit number of files (e.g., maximum 10 images)
      if (files.length > 10) {
        return NextResponse.json(
          { success: false, message: "Maximum 10 images allowed" },
          { status: 400 }
        );
      }

      try {
        for (const file of files) {
          if (file instanceof File) {
            const filePath = await saveFile(file, file.name);
            uploadedPaths.push(filePath);
          }
        }
      } catch (error) {
        return NextResponse.json(
          { 
            success: false, 
            message: error instanceof Error ? error.message : "File upload failed" 
          },
          { status: 400 }
        );
      }
    }

     // Extract other form fields
     const title = formData.get('title') as string;
     const location = formData.get('location') as string;
     const description = formData.get('description') as string;
     const status = formData.get('status') as string;
     const dtype = formData.get('dtype') as string;
     const startDate = formData.get('startDate') as string;
     const EndDate = formData.get('EndDate') as string;
     const timeInterval = formData.get('timeInterval') as string;
     const placeLink = formData.get('placeLink') as string;
     
     // Parse geoLocation if provided
     let geoLocation;
     const geoLocationStr = formData.get('geoLocation');
     if (geoLocationStr) {
       try {
         geoLocation = JSON.parse(geoLocationStr as string);
       } catch (error) {
         console.error('Error parsing geoLocation:', error);
       }
     }
 
     // Create drive in database
     const drive = await prisma.drive.create({
       data: {
         title,
         location,
         description,
         status: status || "pending",
         dtype,
         startDate,
         EndDate,
         timeInterval,
         geoLocation: geoLocation || undefined,
         placeLink: placeLink || undefined,
         photos: uploadedPaths,
         createdAt: new Date(),
       },
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
         message: "Failed to create drive",
         error: error instanceof Error ? error.message : "Unknown error"
       },
       { status: 500 }
     );
   }
 }

 
// Configure body size limit for file uploads
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
    responseLimit: false,
  },
};