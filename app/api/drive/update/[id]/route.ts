// app/api/drive/update/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Helper function to save uploaded files
async function saveFile(file: File): Promise<string> {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "Drive_images");
    await mkdir(uploadDir, { recursive: true });
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${file.name}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    
    await writeFile(filePath, buffer);
    return `/uploads/Drive_images/${uniqueFileName}`;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
      const { id } = params;
      const formData = await request.formData();
      
      // Handle file uploads
      const files = formData.getAll('newPhotos') as File[];
      const existingPhotos = JSON.parse(formData.get('existingPhotos') as string || '[]');
      
      // Process new photos
      const newPhotoPaths: string[] = [];
      if (files.length > 0) {
          for (const file of files) {
              if (file instanceof File) {
                  const filePath = await saveFile(file);
                  newPhotoPaths.push(filePath);
              }
          }
      }

      // Combine existing and new photos
      const allPhotos = [...existingPhotos, ...newPhotoPaths];

      // Create update data object
      const updateData: any = {
          title: formData.get('title') as string,
          location: formData.get('location') as string,
          description: formData.get('description') as string,
          status: formData.get('status') as string,
          dtype: formData.get('dtype') as string,
          startDate: formData.get('startDate') as string,
          EndDate: formData.get('EndDate') as string,
          timeInterval: formData.get('timeInterval') as string,
          photos: allPhotos,
      };

      // Handle placeLink
      const placeLink = formData.get('placeLink');
      if (placeLink) {
          updateData.placeLink = placeLink as string;
      }

      // Handle geoLocation
      const geoLocationStr = formData.get('geoLocation');
      if (geoLocationStr) {
          try {
              const geoLocation = JSON.parse(geoLocationStr as string);
              updateData.geoLocation = geoLocation;
          } catch (error) {
              console.error('Error parsing geoLocation:', error);
          }
      }

      // Update drive in database
      const updatedDrive = await prisma.drive.update({
          where: { id },
          data: updateData,
      });

      return NextResponse.json({
          success: true,
          message: "Drive updated successfully",
          drive: updatedDrive,
      });

  } catch (error) {
      console.error("Error updating drive:", error);
      return NextResponse.json(
          { 
              success: false, 
              message: "Failed to update drive",
              error: error instanceof Error ? error.message : "Unknown error"
          },
          { status: 500 }
      );
  }
}