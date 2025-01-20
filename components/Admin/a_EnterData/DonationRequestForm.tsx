"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import Papa from "papaparse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface DonationRequest {
  fullname: string;
  mobile: string;
  email: string;
  address: string;
  type: string;
  quantity: string;
}

export default function DonationRequestForm() {
  const [csvData, setCsvData] = useState<DonationRequest[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const validateMobile = (mobile: string) => {
    return /^\d{10}$/.test(mobile.trim());
  };

  const validateRow = (row: DonationRequest): string[] => {
    const rowErrors: string[] = [];
    if (!row.fullname?.trim()) rowErrors.push("Fullname is required");
    if (!validateMobile(row.mobile)) rowErrors.push("Invalid mobile number");
    if (!validateEmail(row.email)) rowErrors.push("Invalid email format");
    if (!row.address?.trim()) rowErrors.push("Address is required");
    if (!row.type?.trim()) rowErrors.push("Type is required");
    if (!row.quantity?.trim()) rowErrors.push("Quantity is required");
    return rowErrors;
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        fullname: "John Doe",
        mobile: "1234567890",
        email: "john@example.com",
        address: "123 Main St",
        type: "Food",
        quantity: "10 kg",
      },
    ];
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donation_requests_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    setErrors([]);
    
    Papa.parse(file, {
      complete: (results) => {
        const parsedData = results.data as DonationRequest[];
        const allErrors: string[] = [];
        
        parsedData.forEach((row, index) => {
          const rowErrors = validateRow(row);
          if (rowErrors.length > 0) {
            allErrors.push(`Row ${index + 1}: ${rowErrors.join(", ")}`);
          }
        });

        if (allErrors.length > 0) {
          setErrors(allErrors);
          setCsvData([]);
        } else {
          setErrors([]);
          setCsvData(parsedData);
        }
        setIsParsingFile(false);
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        toast({
          variant: "destructive",
          title: "Error parsing CSV",
          description: error.message
        });
        setIsParsingFile(false);
      }
    });
  };

  const clearData = () => {
    setCsvData([]);
    setErrors([]);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async () => {
    if (csvData.length === 0) {
      toast({
        title: "Error",
        description: "No valid data to submit",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/enterdata/donation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donations: csvData }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit donation requests");
      }

      toast({
        title: "Success",
        description: "Donation requests imported successfully",
      });
      clearData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit donation requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={handleDownloadTemplate}>
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
                    <TableHead>Full Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.fullname}</TableCell>
                      <TableCell>{row.mobile}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
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
}

{/*"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import Papa from "papaparse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface DonationRequest {
  fullname: string;
  mobile: string;
  email: string;
  address: string;
  type: string;
  quantity: string;
}

export default function DonationRequestForm() {
  const [csvData, setCsvData] = useState<DonationRequest[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const validateMobile = (mobile: string) => {
    return /^\d{10}$/.test(mobile.trim());
  };

  const validateRow = (row: DonationRequest): string[] => {
    const rowErrors: string[] = [];
    if (!row.fullname?.trim()) rowErrors.push("Fullname is required");
    if (!validateMobile(row.mobile)) rowErrors.push("Invalid mobile number");
    if (!validateEmail(row.email)) rowErrors.push("Invalid email format");
    if (!row.address?.trim()) rowErrors.push("Address is required");
    if (!row.type?.trim()) rowErrors.push("Type is required");
    if (!row.quantity?.trim()) rowErrors.push("Quantity is required");
    return rowErrors;
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        fullname: "John Doe",
        mobile: "1234567890",
        email: "john@example.com",
        address: "123 Main St",
        type: "Food",
        quantity: "10 kg",
      },
    ];
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donation_requests_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsedData = results.data as DonationRequest[];
        const allErrors: string[] = [];
        
        parsedData.forEach((row, index) => {
          const rowErrors = validateRow(row);
          if (rowErrors.length > 0) {
            allErrors.push(`Row ${index + 1}: ${rowErrors.join(", ")}`);
          }
        });

        if (allErrors.length > 0) {
          setErrors(allErrors);
          setCsvData([]);
        } else {
          setErrors([]);
          setCsvData(parsedData);
        }
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const handleSubmit = async () => {
    if (csvData.length === 0) {
      toast({
        title: "Error",
        description: "No valid data to submit",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/enterdata/donation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donations: csvData }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit donation requests");
      }

      toast({
        title: "Success",
        description: "Donation requests imported successfully",
      });
      setCsvData([]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit donation requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Donation Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={handleDownloadTemplate}>
              Download Template
            </Button>
            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csvUpload"
              />
              <Button asChild>
                <label htmlFor="csvUpload">Upload CSV</label>
              </Button>
            </div>
          </div>

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
                      <TableHead>Full Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.fullname}</TableCell>
                        <TableCell>{row.mobile}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.address}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCsvData([])}
                  disabled={isLoading}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}*/}