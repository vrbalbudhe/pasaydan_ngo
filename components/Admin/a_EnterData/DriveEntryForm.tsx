"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { Loader2 } from "lucide-react";

const VALID_STATUSES = ["pending", "active", "completed"] as const;
type DriveStatus = (typeof VALID_STATUSES)[number];

// Field configuration
const fieldConfig = {
  baseFields: {
    title: { required: true },
    location: { required: true },
    description: { required: true },
    dtype: { required: true },
    startDate: { required: true, format: "DD-MM-YYYY" },
    EndDate: { required: true, format: "DD-MM-YYYY" },
    timeInterval: { required: true },
    status: { required: false, format: "pending/active/completed" },
    placeLink: { required: false },
    "geolocation.latitude": { required: false },
    "geolocation.longitude": { required: false },
  },
};

interface GeoLocation {
  latitude?: string;
  longitude?: string;
}

interface DriveData {
  title: string;
  location: string;
  description: string;
  status?: DriveStatus;
  dtype: string;
  startDate: string;
  EndDate: string;
  timeInterval: string;
  placeLink?: string;
  geolocation?: GeoLocation;
}

// Get header name with format and requirement hints
const getHeaderName = (field: string): string => {
  const config =
    fieldConfig.baseFields[field as keyof typeof fieldConfig.baseFields];
  if (!config) return field;

  let header = field;
  if (field === "status") {
    return "status (pending/active/completed)";
  }
  if (config.format) {
    header = `${header} (${config.format})`;
  }
  if (config.required) {
    header = `${header}*`;
  } else {
    header = `${header} (optional)`;
  }
  return header;
};

const DriveEntryForm = () => {
  const [csvData, setCSVData] = useState<DriveData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const { toast } = useToast();

  const convertToYYYYMMDD = (dateStr: string): string => {
    if (!dateStr) return dateStr;
    const cleanDate = dateStr.replace(/ \(DD-MM-YYYY\)\*?/, "");
    const parts = cleanDate.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  };

  const getSampleData = () => {
    return {
      "title*": "Sample Drive",
      "location*": "Mumbai",
      "description*": "Drive description here",
      "dtype*": "Food",
      "startDate (DD-MM-YYYY)*": "15-01-2025",
      "EndDate (DD-MM-YYYY)*": "16-01-2025",
      "timeInterval*": "10:00 AM - 5:00 PM",
      "status (pending/active/completed)": "pending",
      "placeLink (optional)": "https://maps.google.com",
      "geolocation.latitude (optional)": "12.1678",
      "geolocation.longitude (optional)": "31.5432",
    };
  };

  const downloadTemplate = () => {
    const headers = Object.keys(fieldConfig.baseFields).map(getHeaderName);
    const sampleData = getSampleData();
    const dataRow = headers.map((header) => String(sampleData[header] || ""));

    const csvContent = Papa.unparse({
      fields: headers,
      data: [dataRow],
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drive_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const validateData = (data: any[]): string[] => {
    const errors: string[] = [];

    data.forEach((row, index) => {
      // Validate required fields
      Object.entries(fieldConfig.baseFields).forEach(([field, config]) => {
        if (config.required) {
          const headerVariations = [
            field,
            `${field}*`,
            `${field} (${config.format})`,
            `${field} (${config.format})*`,
          ];

          const value = headerVariations.reduce(
            (val, header) => val || row[header]?.toString().trim(),
            ""
          );

          if (!value) {
            errors.push(`Row ${index + 1}: ${field} is required`);
          }
        }
      });

      // Date validation
      const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-\d{4}$/;
      const startDateKey = Object.keys(row).find((k) =>
        k.startsWith("startDate")
      );
      const endDateKey = Object.keys(row).find((k) => k.startsWith("EndDate"));

      if (
        startDateKey &&
        row[startDateKey] &&
        !dateRegex.test(row[startDateKey])
      ) {
        errors.push(
          `Row ${index + 1}: Start date should be in DD-MM-YYYY format`
        );
      }
      if (endDateKey && row[endDateKey] && !dateRegex.test(row[endDateKey])) {
        errors.push(
          `Row ${index + 1}: End date should be in DD-MM-YYYY format`
        );
      }

      // Status validation
      const statusKey = "status (pending/active/completed)";
      if (
        row[statusKey] &&
        !VALID_STATUSES.includes(row[statusKey].toLowerCase() as DriveStatus)
      ) {
        errors.push(
          `Row ${index + 1}: Status must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }
    });

    return errors;
  };

  const transformDataForSubmission = (data: any[]): DriveData[] => {
    return data.map((row) => {
      // Initialize with required fields
      const transformed: DriveData = {
        title: "",
        location: "",
        description: "",
        dtype: "",
        startDate: "",
        EndDate: "",
        timeInterval: "",
        status: "pending", // Default status
      };

      // Map fields from CSV to data structure
      Object.entries(fieldConfig.baseFields).forEach(([field, config]) => {
        let headerToUse = "";
        const possibleHeaders = [
          field,
          `${field}*`,
          `${field} (${config.format})`,
          `${field} (${config.format})*`,
          field === "status" ? "status (pending/active/completed)" : "",
          `${field} (optional)`,
        ];

        // Find the first header that exists in the row
        for (const header of possibleHeaders) {
          if (row[header]) {
            headerToUse = header;
            break;
          }
        }

        const value = row[headerToUse]?.toString().trim();

        switch (field) {
          case "startDate":
          case "EndDate":
            if (value) {
              transformed[field] = convertToYYYYMMDD(value);
            }
            break;

          case "status":
            transformed.status =
              (value?.toLowerCase() as DriveStatus) || "pending";
            break;

          case "placeLink":
            if (value) transformed.placeLink = value;
            break;

          case "geolocation.latitude":
          case "geolocation.longitude":
            if (value) {
              if (!transformed.geolocation) transformed.geolocation = {};
              transformed.geolocation[
                field.split(".")[1] as keyof GeoLocation
              ] = value;
            }
            break;

          default:
            if (field in transformed) {
              transformed[field as keyof DriveData] = value || "";
            }
        }
      });

      return transformed;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    setErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validationErrors = validateData(results.data);

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          setCSVData([]);
        } else {
          const transformedData = transformDataForSubmission(results.data);
          setCSVData(transformedData);
          setErrors([]);
        }
        setIsParsingFile(false);
      },
      error: (error) => {
        toast({
          variant: "destructive",
          title: "Error parsing CSV",
          description: error.message,
        });
        setIsParsingFile(false);
      },
    });
  };

  const clearData = () => {
    setCSVData([]);
    setErrors([]);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async () => {
    if (csvData.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/enterdata/drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drives: csvData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit data");
      }

      toast({
        title: "Success",
        description: "Drive data imported successfully",
      });

      clearData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to import drive data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTableColumns = () => {
    const baseColumns = [
      "title",
      "location",
      "description",
      "dtype",
      "startDate",
      "EndDate",
      "timeInterval",
      "status",
    ];
    const optionalColumns = ["placeLink"];

    const columns = [...baseColumns];

    // Add optional columns if they have data
    optionalColumns.forEach((col) => {
      if (csvData.some((row) => row[col as keyof DriveData])) {
        columns.push(col);
      }
    });

    // Add geolocation columns if they have data
    if (csvData.some((row) => row.geolocation?.latitude))
      columns.push("geolocation.latitude");
    if (csvData.some((row) => row.geolocation?.longitude))
      columns.push("geolocation.longitude");

    return columns;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4 md:flex-nowrap flex-wrap">
          <Button className="w-full md:w-fit" onClick={downloadTemplate}>
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
                        {column.split(".").pop()}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, index) => (
                    <TableRow key={index}>
                      {getTableColumns().map((column) => (
                        <TableCell key={column}>
                          {column.startsWith("geolocation.")
                            ? row.geolocation?.[
                                column.split(".")[1] as keyof GeoLocation
                              ] || "-"
                            : row[column as keyof DriveData] || "-"}
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
  );
};

export default DriveEntryForm;
