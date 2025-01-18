import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma/client"

interface DriveRequest {
  drives: {
    title: string
    location: string
    description: string
    dtype: string
    startDate: string
    EndDate: string
    timeInterval: string
    placeLink?: string
    geolocation?: {
      latitude?: string
      longitude?: string
    }
  }[]
}

const convertToYYYYMMDD = (dateStr: string): string => {
  // Check if the date is already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // Handle DD-MM-YYYY format (including format hint)
  const cleanDateStr = dateStr.replace(' (DD-MM-YYYY)', '')
  const parts = cleanDateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

const isValidDate = (dateStr: string): boolean => {
  // Remove format hint if present
  const cleanDateStr = dateStr.replace(' (DD-MM-YYYY)', '')
  
  // Accept both DD-MM-YYYY and YYYY-MM-DD formats
  const ddmmyyyyRegex = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-\d{4}$/
  const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/

  if (!ddmmyyyyRegex.test(cleanDateStr) && !yyyymmddRegex.test(cleanDateStr)) {
    return false
  }

  let year: number, month: number, day: number

  if (ddmmyyyyRegex.test(cleanDateStr)) {
    [day, month, year] = cleanDateStr.split('-').map(Number)
  } else {
    [year, month, day] = cleanDateStr.split('-').map(Number)
  }

  // Validate the actual date
  const date = new Date(year, month - 1, day)
  return date.getDate() === day && 
         date.getMonth() === month - 1 && 
         date.getFullYear() === year
}

const isValidGeolocation = (lat?: string, long?: string): boolean => {
  if (!lat && !long) return true // Optional field
  const latRegex = /^-?([0-8]?[0-9]|90)(\.[0-9]+)?$/
  const longRegex = /^-?([0-9]|[1-9][0-9]|1[0-7][0-9]|180)(\.[0-9]+)?$/
  
  if (lat && !latRegex.test(lat)) return false
  if (long && !longRegex.test(long)) return false
  return true
}

const validateDrive = (drive: DriveRequest['drives'][0]): string[] => {
  const errors: string[] = []

  // Required fields validation with trimming
  if (!drive.title?.toString().trim()) errors.push("Title is required")
  if (!drive.location?.toString().trim()) errors.push("Location is required")
  if (!drive.description?.toString().trim()) errors.push("Description is required")
  if (!drive.dtype?.toString().trim()) errors.push("Drive type is required")
  if (!drive.startDate?.toString().trim()) errors.push("Start date is required")
  if (!drive.EndDate?.toString().trim()) errors.push("End date is required")
  if (!drive.timeInterval?.toString().trim()) errors.push("Time interval is required")

  // Date validation
  if (drive.startDate && !isValidDate(drive.startDate)) {
    errors.push("Start date must be in DD-MM-YYYY format")
  }
  if (drive.EndDate && !isValidDate(drive.EndDate)) {
    errors.push("End date must be in DD-MM-YYYY format")
  }

  // Date range validation
  if (drive.startDate && drive.EndDate && 
      isValidDate(drive.startDate) && isValidDate(drive.EndDate)) {
    const start = new Date(convertToYYYYMMDD(drive.startDate))
    const end = new Date(convertToYYYYMMDD(drive.EndDate))
    if (end < start) {
      errors.push("End date cannot be before start date")
    }
  }

  // Geolocation validation
  if (drive.geolocation) {
    if (!isValidGeolocation(
      drive.geolocation.latitude, 
      drive.geolocation.longitude
    )) {
      errors.push("Invalid geolocation format")
    }
  }

  return errors
}

export async function POST(request: NextRequest) {
  try {
    const body: DriveRequest = await request.json()

    if (!Array.isArray(body.drives) || body.drives.length === 0) {
      return NextResponse.json(
        { error: "No drive data provided" },
        { status: 400 }
      )
    }

    // Validate all drives first
    const validationErrors: { [key: number]: string[] } = {}
    body.drives.forEach((drive, index) => {
      const errors = validateDrive(drive)
      if (errors.length > 0) {
        validationErrors[index] = errors
      }
    })

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validationErrors
        },
        { status: 400 }
      )
    }

    // Process the drives in batches of 100
    const batchSize = 100
    const results = []
    
    for (let i = 0; i < body.drives.length; i += batchSize) {
      const batch = body.drives.slice(i, i + batchSize)
      
      const batchResults = await prisma.$transaction(
        batch.map(drive => {
          const driveData = {
            ...drive,
            startDate: convertToYYYYMMDD(drive.startDate),  // Convert date format
            EndDate: convertToYYYYMMDD(drive.EndDate),      // Convert date format
            status: "pending",
            photos: [], // Initialize empty photos array
            geoLocation: drive.geolocation ? {
              latitude: drive.geolocation.latitude || "",
              longitude: drive.geolocation.longitude || ""
            } : null,  // Changed from undefined to null for MongoDB
          }
          
          // Remove the original geolocation field as it's now transformed
          delete (driveData as any).geolocation
          
          return prisma.drive.create({
            data: driveData
          })
        })
      )
      
      results.push(...batchResults)
    }

    return NextResponse.json({
      message: "Drives imported successfully",
      count: results.length,
      success: true
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing drive import:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: error.message,
          success: false
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "An unexpected error occurred",
        success: false
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  const templateStructure = {
    required: [
      'title',
      'location',
      'description',
      'dtype',
      'startDate (DD-MM-YYYY)',
      'EndDate (DD-MM-YYYY)',
      'timeInterval'
    ],
    optional: [
      'placeLink',
      'geolocation.latitude',
      'geolocation.longitude'
    ],
    example: {
      title: 'Sample Drive',
      location: 'Mumbai',
      description: 'Drive description here',
      dtype: 'Food',
      'startDate (DD-MM-YYYY)': '15-01-2025',
      'EndDate (DD-MM-YYYY)': '16-01-2025',
      timeInterval: '10:00 AM - 5:00 PM',
      placeLink: 'https://maps.google.com',
      'geolocation.latitude': '12.1678',
      'geolocation.longitude': '31.5432'
    }
  }

  return NextResponse.json(templateStructure)
}