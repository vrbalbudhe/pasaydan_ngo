"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";  // Change this line
import { Loader2 } from "lucide-react";

// Define form schema
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters long" }).max(100),
  location: z.string().min(2, { message: "Location must be at least 2 characters long" }).max(100),
  description: z.string().min(2, { message: "Description must be at least 2 characters long" }).max(500),
  status: z.enum(["pending", "active", "completed"]),
  dtype: z.string().min(2, { message: "Drive Type must be at least 2 characters long" }).max(50),
  startDate: z.string().min(2, { message: "Start Date is required" }),
  EndDate: z.string().min(2, { message: "End Date is required" }),
  timeInterval: z.string().min(2, { message: "Time Interval must be at least 2 characters long" }).max(50),
  placeLink: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  latitude: z.string().optional().or(z.literal("")),
  longitude: z.string().optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateDriveForm() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "pending",
      placeLink: "",
      latitude: "",
      longitude: ""
    }
  });

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      // Validate file count
      if (selectedFiles.length > 10) {
        toast({
          variant: "destructive",
          title: "Too many files",
          description: "Maximum 10 images allowed"
        });
        return;
      }

      // Validate file types and sizes
      const validFiles: File[] = [];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      Array.from(selectedFiles).forEach(file => {
        if (!allowedTypes.includes(file.type)) {
          toast({
            variant: "destructive",
            title: "Invalid file type",
            description: `${file.name} is not a valid image file`
          });
          return;
        }

        if (file.size > maxSize) {
          toast({
            variant: "destructive",
            title: "File too large",
            description: `${file.name} exceeds 5MB limit`
          });
          return;
        }

        validFiles.push(file);
      });

      setFiles(validFiles);
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
  
      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        // Only append if the value exists and is not an empty string
        if (value !== undefined && value !== "") {
          // Handle geolocation data separately
          if (key === 'latitude' || key === 'longitude') {
            // Don't append individual lat/lng fields to FormData
            return;
          }
          formData.append(key, value);
        }
      });
  
      // Handle geolocation as a single JSON object
      if (data.latitude && data.longitude) {
        formData.append('geoLocation', JSON.stringify({
          latitude: data.latitude,
          longitude: data.longitude
        }));
      }
  
      // Append files
      files.forEach(file => {
        formData.append('photos', file);
      });
  
      // Submit form
      const response = await fetch("/api/drive/create", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to create drive");
      }
  
      const result = await response.json();
  
      // Show success message
      toast({
        title: "Success",
        description: "Drive created successfully"
      });
  
      // Reset form
      reset();
      setFiles([]);
  
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create drive"
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create a Drive</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to create a new drive
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter drive title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter drive description"
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Drive Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-destructive mt-1">{errors.status.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dtype">Drive Type</Label>
                <Input
                  id="dtype"
                  {...register("dtype")}
                  placeholder="Enter drive type"
                />
                {errors.dtype && (
                  <p className="text-sm text-destructive mt-1">{errors.dtype.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    type="date"
                    id="startDate"
                    {...register("startDate")}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="EndDate">End Date</Label>
                  <Input
                    type="date"
                    id="EndDate"
                    {...register("EndDate")}
                  />
                  {errors.EndDate && (
                    <p className="text-sm text-destructive mt-1">{errors.EndDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="timeInterval">Time Interval</Label>
                <Input
                  id="timeInterval"
                  {...register("timeInterval")}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
                {errors.timeInterval && (
                  <p className="text-sm text-destructive mt-1">{errors.timeInterval.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="placeLink">Place Link (Optional)</Label>
              <Input
                id="placeLink"
                {...register("placeLink")}
                placeholder="Enter Google Maps or location URL"
              />
              {errors.placeLink && (
                <p className="text-sm text-destructive mt-1">{errors.placeLink.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude (Optional)</Label>
                <Input
                  id="latitude"
                  {...register("latitude")}
                  placeholder="e.g., 12.9716"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude (Optional)</Label>
                <Input
                  id="longitude"
                  {...register("longitude")}
                  placeholder="e.g., 77.5946"
                />
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <Label htmlFor="photos">Upload Photos</Label>
            <Input
              type="file"
              id="photos"
              onChange={handleFileChange}
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="cursor-pointer"
            />
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Selected files:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Drive...
              </>
            ) : (
              "Create Drive"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}