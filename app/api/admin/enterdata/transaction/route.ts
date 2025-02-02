import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma/client"

const VALID_USER_TYPES = ['INDIVIDUAL', 'ORGANIZATION'] as const
const VALID_TRANSACTION_TYPES = ['UPI', 'NET_BANKING', 'CARD', 'CASH'] as const
const VALID_TRANSACTION_NATURES = ['CREDIT', 'DEBIT'] as const
const VALID_ENTRY_TYPES = ['MANUAL', 'DONATION_FORM'] as const
const VALID_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED'] as const
const VALID_MONEY_CATEGORIES = ['CLOTHES', 'FOOD', 'CYCLE', 'EDUCATION', 'HEALTHCARE', 'OTHER'] as const

type UserType = typeof VALID_USER_TYPES[number]
type TransactionType = typeof VALID_TRANSACTION_TYPES[number]
type TransactionNature = typeof VALID_TRANSACTION_NATURES[number]
type EntryType = typeof VALID_ENTRY_TYPES[number]
type TransactionStatus = typeof VALID_STATUSES[number]
type MoneyForCategory = typeof VALID_MONEY_CATEGORIES[number]

interface TransactionRequest {
  transactions: {
    name: string
    email: string
    phone: string
    userType: UserType
    amount: number | string
    type: TransactionType
    transactionId: string
    date: string
    transactionNature: TransactionNature
    screenshotPath?: string
    entryType: EntryType
    entryBy: string
    description?: string
    status?: TransactionStatus
    statusDescription?: string
    verifiedBy?: string
    verifiedAt?: string
    moneyFor: MoneyForCategory
    customMoneyFor?: string
    userId?: string
    organizationId?: string
  }[]
}

// Function to clean and convert date format
const convertToYYYYMMDD = (dateStr: string): string => {
  try {
    const cleanDateStr = dateStr.replace(/ \(DD-MM-YYYY\)\*?/, '').trim()
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDateStr)) {
      return cleanDateStr
    }

    const parts = cleanDateStr.split('-')
    if (parts.length !== 3) return dateStr

    const day = parts[0].padStart(2, '0')
    const month = parts[1].padStart(2, '0')
    const year = parts[2]

    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('Error converting date:', error)
    return dateStr
  }
}

// Function to validate date format and value
const isValidDate = (dateStr: string): boolean => {
  try {
    const cleanDateStr = dateStr.replace(/ \(DD-MM-YYYY\)\*?/, '').trim()
    
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

    const date = new Date(year, month - 1, day)
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year
  } catch (error) {
    console.error('Error validating date:', error)
    return false
  }
}

// Function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Function to validate phone number format
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s-]{10,}$/
  return phoneRegex.test(phone)
}

// Main validation function
const validateTransaction = (transaction: TransactionRequest['transactions'][0]): string[] => {
  const errors: string[] = []

  try {
    // Required fields validation with proper trimming
    if (!transaction.name?.toString().trim()) errors.push("Name is required")
    if (!transaction.email?.toString().trim()) {
      errors.push("Email is required")
    } else if (!isValidEmail(transaction.email)) {
      errors.push("Invalid email format")
    }
    
    if (!transaction.phone?.toString().trim()) {
      errors.push("Phone number is required")
    } else if (!isValidPhone(transaction.phone)) {
      errors.push("Invalid phone number format")
    }

    if (!transaction.amount) {
      errors.push("Amount is required")
    } else if (isNaN(Number(transaction.amount)) || Number(transaction.amount) <= 0) {
      errors.push("Amount must be a positive number")
    }

    if (!transaction.transactionId?.toString().trim()) {
      errors.push("Transaction ID is required")
    }

    // Date validation
    if (!transaction.date?.toString().trim()) {
      errors.push("Date is required")
    } else if (!isValidDate(transaction.date)) {
      errors.push("Date must be in DD-MM-YYYY format")
    }

    // Enum validations
    if (!transaction.userType || !VALID_USER_TYPES.includes(transaction.userType)) {
      errors.push(`User type must be one of: ${VALID_USER_TYPES.join(', ')}`)
    }

    if (!transaction.type || !VALID_TRANSACTION_TYPES.includes(transaction.type)) {
      errors.push(`Transaction type must be one of: ${VALID_TRANSACTION_TYPES.join(', ')}`)
    }

    if (!transaction.transactionNature || !VALID_TRANSACTION_NATURES.includes(transaction.transactionNature)) {
      errors.push(`Transaction nature must be one of: ${VALID_TRANSACTION_NATURES.join(', ')}`)
    }

    if (!transaction.entryType || !VALID_ENTRY_TYPES.includes(transaction.entryType)) {
      errors.push(`Entry type must be one of: ${VALID_ENTRY_TYPES.join(', ')}`)
    }

    if (!transaction.entryBy?.toString().trim()) {
      errors.push("Entry by is required")
    }

    if (!transaction.moneyFor || !VALID_MONEY_CATEGORIES.includes(transaction.moneyFor)) {
      errors.push(`Money for category must be one of: ${VALID_MONEY_CATEGORIES.join(', ')}`)
    }

    // Optional field validations
    if (transaction.status && !VALID_STATUSES.includes(transaction.status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`)
    }

    if (transaction.verifiedAt && !isValidDate(transaction.verifiedAt)) {
      errors.push("Verified at date must be in DD-MM-YYYY format")
    }
  } catch (error) {
    console.error('Error in transaction validation:', error)
    errors.push("Error validating transaction data")
  }

  return errors
}

export async function POST(request: NextRequest) {
  try {
    const body: TransactionRequest = await request.json()

    if (!Array.isArray(body.transactions) || body.transactions.length === 0) {
      return NextResponse.json(
        { error: "No transaction data provided" },
        { status: 400 }
      )
    }

    // Validate all transactions first
    const validationErrors: { [key: number]: string[] } = {}
    body.transactions.forEach((transaction, index) => {
      const errors = validateTransaction(transaction)
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

    // Process the transactions in batches of 100
    const batchSize = 100
    const results = []
    
    for (let i = 0; i < body.transactions.length; i += batchSize) {
      const batch = body.transactions.slice(i, i + batchSize)
      
      const batchResults = await prisma.$transaction(
        batch.map(transaction => {
          // Prepare the data for database insertion
          const transactionData = {
            name: transaction.name.trim(),
            email: transaction.email.trim(),
            phone: transaction.phone.trim(),
            userType: transaction.userType,
            amount: Number(transaction.amount),
            type: transaction.type,
            transactionId: transaction.transactionId.trim(),
            date: new Date(convertToYYYYMMDD(transaction.date)),
            transactionNature: transaction.transactionNature,
            screenshotPath: transaction.screenshotPath?.trim() || null,
            entryType: transaction.entryType,
            entryBy: transaction.entryBy.trim(),
            description: transaction.description?.trim() || null,
            status: transaction.status || 'PENDING',
            statusDescription: transaction.statusDescription?.trim() || null,
            verifiedBy: transaction.verifiedBy?.trim() || null,
            verifiedAt: transaction.verifiedAt ? new Date(convertToYYYYMMDD(transaction.verifiedAt)) : null,
            moneyFor: transaction.moneyFor,
            customMoneyFor: transaction.customMoneyFor?.trim() || null,
            userId: transaction.userId || null,
            organizationId: transaction.organizationId || null
          }
          
          return prisma.transaction.create({
            data: transactionData
          })
        })
      )
      
      results.push(...batchResults)
    }

    return NextResponse.json({
      message: "Transactions imported successfully",
      count: results.length,
      success: true
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing transaction import:', error)
    
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
      'name*',
      'email*',
      'phone*',
      'userType*',
      'amount*',
      'type*',
      'transactionId*',
      'date (DD-MM-YYYY)*',
      'transactionNature*',
      'entryType*',
      'entryBy*',
      'moneyFor*'
    ],
    optional: [
      'screenshotPath',
      'description',
      'status (PENDING/VERIFIED/REJECTED)',
      'statusDescription',
      'verifiedBy',
      'verifiedAt (DD-MM-YYYY)',
      'customMoneyFor',
      'userId',
      'organizationId'
    ],
    example: {
      'name*': 'John Doe',
      'email*': 'john@example.com',
      'phone*': '+91 9876543210',
      'userType*': 'INDIVIDUAL',
      'amount*': '1000',
      'type*': 'UPI',
      'transactionId*': 'TXN123456',
      'date (DD-MM-YYYY)*': '15-01-2025',
      'transactionNature*': 'CREDIT',
      'entryType*': 'MANUAL',
      'entryBy*': 'admin@example.com',
      'moneyFor*': 'EDUCATION',
      'screenshotPath': 'path/to/screenshot.jpg',
      'description': 'Monthly donation',
      'status': 'PENDING',
      'statusDescription': '',
      'verifiedBy': '',
      'verifiedAt': '',
      'customMoneyFor': '',
      'userId': '',
      'organizationId': ''
    }
  }

  return NextResponse.json(templateStructure)
}