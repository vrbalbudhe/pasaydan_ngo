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

// Field configuration
const fieldConfig = {
  baseFields: {
    donationId: { required: true },
    email: { required: false },
    type: { required: true },
    fullname: { required: true },
    mobile: { required: false },
    description: { required: false }
  }
}

interface CertificateData {
  donationId: string
  email: string
  type: string
  fullname: string
  mobile: string
  description?: string
}

// Get header name with format and requirement hints
const getHeaderName = (field: string): string => {
  const config = fieldConfig.baseFields[field as keyof typeof fieldConfig.baseFields]
  if (!config) return field

  let header = field
  if (config.required) {
    header = `${header}*`
  } else {
    header = `${header} (optional)`
  }
  return header
}

const CertificateEntryForm = () => {
  const [csvData, setCSVData] = useState<CertificateData[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isParsingFile, setIsParsingFile] = useState(false)
  const { toast } = useToast()

  const getSampleData = () => {
    return {
      'donationId*': 'DON123456',
      'email*': 'donor@example.com',
      'type*': 'Food Donation',
      'fullname*': 'John Doe',
      'mobile*': '1234567890',
      'description (optional)': 'Donated 100kg of rice'
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
    a.download = 'certificate_template.csv'
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
            `${field}*`
          ]
          
          const value = headerVariations.reduce((val, header) => 
            val || row[header]?.toString().trim(), '')
          
          if (!value) {
            errors.push(`Row ${index + 1}: ${field} is required`)
          }
        }
      })

      // Validate email format
      const emailKey = Object.keys(row).find(k => k.startsWith('email'))
      if (emailKey && row[emailKey]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(row[emailKey])) {
          errors.push(`Row ${index + 1}: Invalid email format`)
        }
      }

      // Validate mobile number
      const mobileKey = Object.keys(row).find(k => k.startsWith('mobile'))
      if (mobileKey && row[mobileKey]) {
        const mobileRegex = /^\d{10}$/
        if (!mobileRegex.test(row[mobileKey])) {
          errors.push(`Row ${index + 1}: Mobile number must be 10 digits`)
        }
      }
    })
    
    return errors
  }

  const transformDataForSubmission = (data: any[]): CertificateData[] => {
    return data.map(row => {
      const transformed: CertificateData = {
        donationId: '',
        email: '',
        type: '',
        fullname: '',
        mobile: '',
      }

      // Map fields from CSV to data structure
      Object.entries(fieldConfig.baseFields).forEach(([field, config]) => {
        let headerToUse = ''
        const possibleHeaders = [
          field,
          `${field}*`,
          `${field} (optional)`
        ]

        // Find the first header that exists in the row
        for (const header of possibleHeaders) {
          if (row[header]) {
            headerToUse = header
            break
          }
        }

        const value = row[headerToUse]?.toString().trim()

        if (field === 'description') {
          if (value) transformed.description = value
        } else {
          transformed[field as keyof CertificateData] = value || ''
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
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
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
      const response = await fetch('/api/admin/enterdata/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificates: csvData })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit data')
      }

      toast({
        title: "Success",
        description: "Certificate data imported successfully"
      })
      
      clearData()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import certificate data"
      })
    } finally {
      setIsLoading(false)
    }
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
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {csvData.length > 0 && (
          <div className="space-y-4">
            {/* Responsive table container */}
            <div className="max-h-96 overflow-auto -mx-4 md:mx-0">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(fieldConfig.baseFields).map((column) => (
                          <TableHead 
                            key={column}
                            className="whitespace-nowrap px-2 md:px-4"
                          >
                            {column}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.map((row, index) => (
                        <TableRow key={index}>
                          {Object.keys(fieldConfig.baseFields).map((column) => (
                            <TableCell 
                              key={column}
                              className={`px-2 md:px-4 ${
                                column === 'description' 
                                  ? 'max-w-xs truncate' 
                                  : column === 'email' 
                                    ? 'break-all'
                                    : 'whitespace-nowrap'
                              }`}
                            >
                              {row[column as keyof CertificateData] || '-'}
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

export default CertificateEntryForm