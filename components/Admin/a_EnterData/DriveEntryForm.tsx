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

// Define the schema structure
const driveSchema = {
  required: [
    'title',
    'location',
    'description',
    'dtype',
    'startDate',
    'EndDate',
    'timeInterval'
  ],
  optional: [
    'placeLink',
    'geolocation.latitude',
    'geolocation.longitude'
  ]
}

interface GeoLocation {
  latitude?: string;
  longitude?: string;
}

interface DriveData {
  title: string
  location: string
  description: string
  status?: string
  dtype: string
  startDate: string
  EndDate: string
  timeInterval: string
  placeLink?: string
  geolocation?: GeoLocation
}

const DriveEntryForm = () => {
  const [csvData, setCSVData] = useState<DriveData[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isParsingFile, setIsParsingFile] = useState(false)
  const { toast } = useToast()

  // Function to get CSV headers dynamically
  const getCSVHeaders = () => {
    return [...driveSchema.required, ...driveSchema.optional]
  }

  // Function to get display headers with format hints
  const getDisplayHeaders = () => {
    return getCSVHeaders().map(header => {
      if (header === 'startDate') return 'startDate (DD-MM-YYYY)'
      if (header === 'EndDate') return 'EndDate (DD-MM-YYYY)'
      return header
    })
  }

  const convertToYYYYMMDD = (dateStr: string): string => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
  
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
  
    return `${year}-${month}-${day}`;
  }

  const getSampleData = () => {
    return {
      title: 'Sample Drive',
      location: 'Mumbai',
      description: 'Drive description here',
      dtype: 'Food',
      startDate: '15-01-2025',
      EndDate: '16-01-2025',
      timeInterval: '10:00 AM - 5:00 PM',
      placeLink: 'https://maps.google.com',
      'geolocation.latitude': '12.1678',
      'geolocation.longitude': '31.5432'
    }
  }

  const downloadTemplate = () => {
    const headers = getDisplayHeaders()
    const sampleData = getSampleData()
    const dataRow = headers.map(header => {
      const cleanHeader = header.split(' ')[0] // Remove format hints for data lookup
      return String(sampleData[cleanHeader] || '')
    })
    
    const csvContent = Papa.unparse({
      fields: headers,
      data: [dataRow]
    }, {
      quotes: true,
      delimiter: ','
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'drive_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const validateData = (data: any[]): string[] => {
    const errors: string[] = []
    
    data.forEach((row, index) => {
      driveSchema.required.forEach(field => {
        const rawValue = row[field] || row[`${field} (DD-MM-YYYY)`] // Check both with and without format hint
        if (!rawValue?.toString().trim()) {
          errors.push(`Row ${index + 1}: ${field} is required`)
        }
      })
      
      const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-\d{4}$/
      const startDate = row.startDate || row['startDate (DD-MM-YYYY)']
      const endDate = row.EndDate || row['EndDate (DD-MM-YYYY)']

      if (startDate && !dateRegex.test(startDate)) {
        errors.push(`Row ${index + 1}: Start date should be in DD-MM-YYYY format`)
      }
      if (endDate && !dateRegex.test(endDate)) {
        errors.push(`Row ${index + 1}: End date should be in DD-MM-YYYY format`)
      }
    })
    
    return errors
  }

  const transformDataForSubmission = (data: any[]): DriveData[] => {
    return data.map(row => {
      const transformedRow: DriveData = {
        title: row.title,
        location: row.location,
        description: row.description,
        dtype: row.dtype,
        startDate: convertToYYYYMMDD(row.startDate || row['startDate (DD-MM-YYYY)']),
        EndDate: convertToYYYYMMDD(row.EndDate || row['EndDate (DD-MM-YYYY)']),
        timeInterval: row.timeInterval,
        placeLink: row.placeLink || undefined
      }
  
      if (row['geolocation.latitude'] || row['geolocation.longitude']) {
        transformedRow.geolocation = {
          latitude: row['geolocation.latitude'],
          longitude: row['geolocation.longitude']
        }
      }
  
      return transformedRow
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
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async () => {
    if (csvData.length === 0) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/enterdata/drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drives: csvData })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit data')
      }

      toast({
        title: "Success",
        description: "Drive data imported successfully"
      })
      
      clearData()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import drive data"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTableColumns = () => {
    const columns = [...driveSchema.required]
    driveSchema.optional.forEach(field => {
      if (csvData.some(row => {
        if (field.includes('geolocation')) {
          return row.geolocation && (row.geolocation.latitude || row.geolocation.longitude)
        }
        return row[field as keyof DriveData]
      })) {
        columns.push(field)
      }
    })
    return columns
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={downloadTemplate}>
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
              hover:file:bg-violet-100"
          />
          {csvData.length > 0 && (
            <Button variant="outline" onClick={clearData}>
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
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {getTableColumns().map((column) => (
                      <TableHead key={column}>
                        {column.split('.').pop()}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, index) => (
                    <TableRow key={index}>
                      {getTableColumns().map((column) => (
                        <TableCell key={column}>
                          {column.startsWith('geolocation.') 
                            ? row.geolocation?.[column.split('.')[1] as keyof GeoLocation] || '-'
                            : row[column as keyof DriveData] || '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

export default DriveEntryForm