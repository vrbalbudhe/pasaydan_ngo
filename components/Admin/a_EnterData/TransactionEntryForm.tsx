"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import Papa from 'papaparse'
import { Loader2 } from "lucide-react"

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

// Field configuration
const fieldConfig = {
  baseFields: {
    name: { required: true },
    email: { required: true },
    phone: { required: true },
    userType: { required: true },
    amount: { required: true },
    type: { required: true },
    transactionId: { required: true },
    date: { required: true, format: 'DD-MM-YYYY' },
    transactionNature: { required: true },
    screenshotPath: { required: false },
    entryType: { required: true },
    entryBy: { required: true },
    description: { required: false },
    status: { required: false },
    statusDescription: { required: false },
    verifiedBy: { required: false },
    verifiedAt: { required: false },
    moneyFor: { required: true },
    customMoneyFor: { required: false },
    userId: { required: false },
    organizationId: { required: false }
  }
}

interface TransactionData {
  name: string
  email: string
  phone: string
  userType: UserType
  amount: number
  type: TransactionType
  transactionId: string
  date: string
  transactionNature: TransactionNature
  screenshotPath?: string
  entryType: EntryType
  entryBy: string
  description?: string
  status: TransactionStatus
  statusDescription?: string
  verifiedBy?: string
  verifiedAt?: string
  moneyFor: MoneyForCategory
  customMoneyFor?: string
  userId?: string
  organizationId?: string
}

// Get header name with format and requirement hints
const getHeaderName = (field: string): string => {
  const config = fieldConfig.baseFields[field as keyof typeof fieldConfig.baseFields]
  if (!config) return field

  let header = field
  if (config.format) {
    header = `${header} (${config.format})`
  }
  if (config.required) {
    header = `${header}*`
  } else {
    header = `${header} (optional)`
  }
  return header
}

const TransactionEntryForm = () => {
  const [csvData, setCSVData] = useState<TransactionData[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isParsingFile, setIsParsingFile] = useState(false)
  const { toast } = useToast()

  const convertToYYYYMMDD = (dateStr: string): string => {
    if (!dateStr) return dateStr
    const cleanDate = dateStr.replace(/ \(DD-MM-YYYY\)\*?/, '')
    const parts = cleanDate.split('-')
    if (parts.length !== 3) return dateStr
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
  }

  const getSampleData = () => {
    return {
      'name*': 'John Doe',
      'email*': 'john@example.com',
      'phone*': '+91 9876543210',
      'userType*': 'INDIVIDUAL',
      'amount*': '1000',
      'type*': 'UPI',
      'transactionId*': 'TXN123456',
      'date (DD-MM-YYYY)*': '15-01-2025',
      'transactionNature*': 'CREDIT',
      'screenshotPath (optional)': 'path/to/screenshot.jpg',
      'entryType*': 'MANUAL',
      'entryBy*': 'admin@example.com',
      'description (optional)': 'Monthly donation',
      'status (optional)': 'PENDING',
      'statusDescription (optional)': '',
      'verifiedBy (optional)': '',
      'verifiedAt (optional)': '',
      'moneyFor*': 'EDUCATION',
      'customMoneyFor (optional)': '',
      'userId (optional)': '',
      'organizationId (optional)': ''
    }
  }

  const downloadTemplate = () => {
    const headers = Object.keys(fieldConfig.baseFields).map(getHeaderName)
    const sampleData = getSampleData()
    const dataRow = headers.map(header => String(sampleData[header] || ''))
    
    const csvContent = Papa.unparse({
      fields: headers,
      data: [dataRow]
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transaction_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const validateData = (data: any[]): string[] => {
    const errors: string[] = []
    
    data.forEach((row, index) => {
      // Validate required fields
      Object.entries(fieldConfig.baseFields).forEach(([field, config]) => {
        if (config.required) {
          const headerVariations = [
            field,
            `${field}*`,
            `${field} (${config.format})`,
            `${field} (${config.format})*`
          ]
          
          const value = headerVariations.reduce((val, header) => 
            val || row[header]?.toString().trim(), '')
          
          if (!value) {
            errors.push(`Row ${index + 1}: ${field} is required`)
          }

          // Additional validation for specific fields
          if (field === 'transactionNature' && value && !VALID_TRANSACTION_NATURES.includes(value as TransactionNature)) {
            errors.push(`Row ${index + 1}: Transaction nature must be one of: ${VALID_TRANSACTION_NATURES.join(', ')}`)
          }
          if (field === 'type' && value && !VALID_TRANSACTION_TYPES.includes(value as TransactionType)) {
            errors.push(`Row ${index + 1}: Transaction type must be one of: ${VALID_TRANSACTION_TYPES.join(', ')}`)
          }
          if (field === 'userType' && value && !VALID_USER_TYPES.includes(value as UserType)) {
            errors.push(`Row ${index + 1}: User type must be one of: ${VALID_USER_TYPES.join(', ')}`)
          }
          if (field === 'moneyFor' && value && !VALID_MONEY_CATEGORIES.includes(value as MoneyForCategory)) {
            errors.push(`Row ${index + 1}: Money for category must be one of: ${VALID_MONEY_CATEGORIES.join(', ')}`)
          }
        }
      })

      // Date validation
      const dateRegex = /^(\d{1,2})-(\d{1,2})-(\d{2}|\d{4})$/
      const dateKey = Object.keys(row).find(k => k.startsWith('date'))
      
      if (dateKey && row[dateKey] && !dateRegex.test(row[dateKey])) {
        errors.push(`Row ${index + 1}: Date should be in DD-MM-YYYY format`)
      }

      // Enum validations
      if (row.userType && !VALID_USER_TYPES.includes(row.userType)) {
        errors.push(`Row ${index + 1}: User type must be one of: ${VALID_USER_TYPES.join(', ')}`)
      }
      if (row.type && !VALID_TRANSACTION_TYPES.includes(row.type)) {
        errors.push(`Row ${index + 1}: Transaction type must be one of: ${VALID_TRANSACTION_TYPES.join(', ')}`)
      }
      if (row.transactionNature && !VALID_TRANSACTION_NATURES.includes(row.transactionNature)) {
        errors.push(`Row ${index + 1}: Transaction nature must be one of: ${VALID_TRANSACTION_NATURES.join(', ')}`)
      }
      if (row.entryType && !VALID_ENTRY_TYPES.includes(row.entryType)) {
        errors.push(`Row ${index + 1}: Entry type must be one of: ${VALID_ENTRY_TYPES.join(', ')}`)
      }
      if (row.status && !VALID_STATUSES.includes(row.status)) {
        errors.push(`Row ${index + 1}: Status must be one of: ${VALID_STATUSES.join(', ')}`)
      }
      if (row.moneyFor && !VALID_MONEY_CATEGORIES.includes(row.moneyFor)) {
        errors.push(`Row ${index + 1}: Money for category must be one of: ${VALID_MONEY_CATEGORIES.join(', ')}`)
      }
    })
    
    return errors
  }

  const transformDataForSubmission = (data: any[]): TransactionData[] => {
    return data.map(row => {
      const transformed: TransactionData = {
        name: '',
        email: '',
        phone: '',
        userType: 'INDIVIDUAL',
        amount: 0,
        type: 'UPI',
        transactionId: '',
        date: '',
        transactionNature: 'CREDIT',
        entryType: 'MANUAL',
        entryBy: '',
        status: 'PENDING',
        moneyFor: 'OTHER'
      }

      Object.entries(fieldConfig.baseFields).forEach(([field, config]) => {
        let headerToUse = ''
        const possibleHeaders = [
          field,
          `${field}*`,
          `${field} (${config.format})`,
          `${field} (${config.format})*`,
          `${field} (optional)`
        ]

        for (const header of possibleHeaders) {
          if (row[header]) {
            headerToUse = header
            break
          }
        }

        const value = row[headerToUse]?.toString().trim()

        switch(field) {
          case 'date':
            if (value) {
              transformed.date = convertToYYYYMMDD(value)
            }
            break

          case 'amount':
            transformed.amount = value ? parseFloat(value) : 0
            break

          default:
            if (field in transformed) {
              transformed[field as keyof TransactionData] = value || transformed[field as keyof TransactionData]
            }
        }
      })

      return transformed
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsParsingFile(true)
    setErrors([])
    
    console.log('Starting file upload')
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Remove asterisks and format hints from headers
        return header.replace(/\*$/, '').replace(/ \([^)]+\)/, '')
      },
      complete: (results) => {
        console.log('Parsed CSV data:', results.data)
        const validationErrors = validateData(results.data)
        
        if (validationErrors.length > 0) {
          setErrors(validationErrors)
          setCSVData([])
        } else {
          const transformedData = transformDataForSubmission(results.data)
          setCSVData(transformedData)
          setErrors([])
        }
        setIsParsingFile(false)
      },
      error: (error) => {
        toast({
          variant: "destructive",
          title: "Error parsing CSV",
          description: error.message
        })
        setIsParsingFile(false)
      }
    })
  }

  const clearData = () => {
    setCSVData([])
    setErrors([])
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async () => {
    if (csvData.length === 0) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/enterdata/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: csvData })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit data')
      }

      toast({
        title: "Success",
        description: "Transaction data imported successfully"
      })
      
      clearData()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import transaction data"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTableColumns = () => {
    // Define essential columns that should always be shown
    const baseColumns = [
      'name', 
      'email', 
      'phone', 
      'userType', 
      'amount', 
      'type', 
      'transactionId', 
      'date', 
      'transactionNature',
      'entryType',
      'entryBy',
      'moneyFor'
    ]
    
    // Add optional columns if they have data
    const optionalColumns = [
      'description',
      'status',
      'statusDescription',
      'verifiedBy',
      'verifiedAt',
      'customMoneyFor',
      'userId',
      'organizationId'
    ]
    
    const columns = [...baseColumns]
    
    optionalColumns.forEach(col => {
      if (csvData.some(row => row[col as keyof TransactionData])) {
        columns.push(col)
      }
    })
    
    return columns
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4 md:space-y-6">
        {/* Responsive controls container */}
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
          <Button 
            onClick={downloadTemplate}
            className="w-full md:w-fit"
          >
            Download CSV Template
          </Button>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100
              md:flex-1"
          />
          {csvData.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearData}
              className="w-full md:w-fit"
            >
              Clear Data
            </Button>
          )}
        </div>

        {isParsingFile && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc pl-4">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm md:text-base">
                    {error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {csvData.length > 0 && (
          <div className="space-y-4">
            {/* Enhanced responsive table container */}
            <div className="max-h-96 overflow-auto -mx-4 md:mx-0">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {getTableColumns().map((column) => (
                          <TableHead 
                            key={column}
                            className="whitespace-nowrap px-2 md:px-4 text-xs md:text-sm"
                          >
                            {column}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.map((row, index) => (
                        <TableRow key={index}>
                          {getTableColumns().map((column) => (
                            <TableCell 
                              key={column}
                              className={`px-2 md:px-4 text-xs md:text-sm ${
                                column === 'description' || column === 'statusDescription'
                                  ? 'max-w-xs truncate'
                                  : column === 'email'
                                    ? 'break-all'
                                    : column === 'amount' || column === 'date'
                                      ? 'tabular-nums'
                                      : 'whitespace-nowrap'
                              }`}
                              title={row[column as keyof TransactionData]?.toString() || '-'}
                            >
                              {column === 'amount'
                                ? typeof row[column] === 'number'
                                  ? row[column].toLocaleString('en-IN', {
                                      style: 'currency',
                                      currency: 'INR'
                                    })
                                  : row[column]?.toString() || '-'
                                : row[column as keyof TransactionData]?.toString() || '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Import Data"
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default TransactionEntryForm