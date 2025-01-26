import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma/client"

interface CertificateRequest {
  certificates: {
    donationId: string
    email: string
    type: string
    fullname: string
    mobile: string
    description?: string
  }[]
}

// Validation function for email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validation function for mobile number
const isValidMobile = (mobile: string): boolean => {
  const mobileRegex = /^\d{10}$/
  return mobileRegex.test(mobile)
}

// Main validation function
const validateCertificate = (certificate: CertificateRequest['certificates'][0]): string[] => {
  const errors: string[] = []

  try {
    // Required fields validation with proper trimming
    if (!certificate.donationId?.toString().trim()) errors.push("Donation ID is required")
    if (!certificate.type?.toString().trim()) errors.push("Type is required")
    if (!certificate.fullname?.toString().trim()) errors.push("Full name is required")

    // Email validation
    if (!certificate.email?.toString().trim()) {
      errors.push("Email is required")
    } else if (!isValidEmail(certificate.email)) {
      errors.push("Invalid email format")
    }

    // Mobile validation
    if (!certificate.mobile?.toString().trim()) {
      errors.push("Mobile number is required")
    } else if (!isValidMobile(certificate.mobile)) {
      errors.push("Mobile number must be 10 digits")
    }

  } catch (error) {
    console.error('Error in certificate validation:', error)
    errors.push("Error validating certificate data")
  }

  return errors
}

export async function POST(request: NextRequest) {
  try {
    const body: CertificateRequest = await request.json()

    if (!Array.isArray(body.certificates) || body.certificates.length === 0) {
      return NextResponse.json(
        { error: "No certificate data provided" },
        { status: 400 }
      )
    }

    // Validate all certificates first
    const validationErrors: { [key: number]: string[] } = {}
    body.certificates.forEach((certificate, index) => {
      const errors = validateCertificate(certificate)
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

    // Process the certificates in batches of 100
    const batchSize = 100
    const results = []
    
    for (let i = 0; i < body.certificates.length; i += batchSize) {
      const batch = body.certificates.slice(i, i + batchSize)
      
      const batchResults = await prisma.$transaction(
        batch.map(certificate => {
          // Prepare the data for database insertion
          const certificateData = {
            donationId: certificate.donationId.trim(),
            email: certificate.email.trim(),
            type: certificate.type.trim(),
            fullname: certificate.fullname.trim(),
            mobile: certificate.mobile.trim(),
            description: certificate.description?.trim() || null
          }
          
          return prisma.certificates.create({
            data: certificateData
          })
        })
      )
      
      results.push(...batchResults)
    }

    return NextResponse.json({
      message: "Certificates imported successfully",
      count: results.length,
      success: true
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing certificate import:', error)
    
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
      'donationId*',
      'email*',
      'type*',
      'fullname*',
      'mobile*'
    ],
    optional: [
      'description (optional)'
    ],
    example: {
      'donationId*': 'DON123456',
      'email*': 'donor@example.com',
      'type*': 'Food Donation',
      'fullname*': 'John Doe',
      'mobile*': '1234567890',
      'description (optional)': 'Donated 100kg of rice'
    }
  }

  return NextResponse.json(templateStructure)
}