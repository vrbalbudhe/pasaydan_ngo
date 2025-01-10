"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(100),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters long" })
    .max(100),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .max(500),
  status: z.enum(["pending", "active", "completed"]),
  dtype: z
    .string()
    .min(2, { message: "Drive Type must be at least 2 characters long" })
    .max(50),
  startDate: z.string().min(2, { message: "Start Date is required" }),
  EndDate: z.string().min(2, { message: "End Date is required" }),
  timeInterval: z
    .string()
    .min(2, { message: "Time Interval must be at least 2 characters long" })
    .max(50),
  photos: z.array(z.instanceof(File)).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateManageForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
      setValue("photos", Array.from(selectedFiles));
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // ... rest of the onSubmit logic remains the same
    setLoading(true);
    setError(null);

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("location", data.location);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("dtype", data.dtype);
    formData.append("startDate", data.startDate);
    formData.append("EndDate", data.EndDate);
    formData.append("timeInterval", data.timeInterval);

    if (data.photos) {
      data.photos.forEach((file) => {
        formData.append("file", file);
      });
    }

    console.log("this is testing:: ", formData);
    try {
      const response = await fetch("/api/drive/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error submitting the form");
      }

      console.log("Drive created successfully");
    } catch (err: any) {
      console.log(formData);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
      <CardHeader className="space-y-1 border-b border-gray-100 bg-gray-50/40 px-8 py-6">
        <CardTitle className="text-2xl font-bold text-gray-900">Create a Drive</CardTitle>
        <p className="text-sm text-gray-600">Fill in the details below to create a new drive</p>
      </CardHeader>

      <CardContent className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Title
                </Label>
                <Input 
                  id="title" 
                  {...register("title")} 
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter drive title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location
                </Label>
                <Input 
                  id="location" 
                  {...register("location")} 
                  className="mt-1 block w-full rounded-lg"
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 min-h-[100px] p-3"
                  placeholder="Enter drive description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description?.message}</p>
                )}
              </div>
            </div>

            {/* Drive Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <select
                  id="status"
                  {...register("status")}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 p-2.5"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dtype" className="text-sm font-medium text-gray-700">
                  Drive Type
                </Label>
                <Input 
                  id="dtype" 
                  {...register("dtype")} 
                  className="mt-1 block w-full rounded-lg"
                  placeholder="Enter drive type"
                />
                {errors.dtype && (
                  <p className="mt-1 text-sm text-red-600">{errors.dtype?.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                    Start Date
                  </Label>
                  <Input 
                    type="date" 
                    id="startDate" 
                    {...register("startDate")} 
                    className="mt-1 block w-full rounded-lg"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate?.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="EndDate" className="text-sm font-medium text-gray-700">
                    End Date
                  </Label>
                  <Input 
                    type="date" 
                    id="EndDate" 
                    {...register("EndDate")} 
                    className="mt-1 block w-full rounded-lg"
                  />
                  {errors.EndDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.EndDate?.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="timeInterval" className="text-sm font-medium text-gray-700">
                  Time Interval
                </Label>
                <Input 
                  id="timeInterval" 
                  {...register("timeInterval")} 
                  className="mt-1 block w-full rounded-lg"
                  placeholder="Enter time interval"
                />
                {errors.timeInterval && (
                  <p className="mt-1 text-sm text-red-600">{errors.timeInterval?.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Label htmlFor="photos" className="text-sm font-medium text-gray-700 block mb-2">
              Upload Photos
            </Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="photos"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={onFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                {files.length > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    {files.length} files selected
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating Drive...</span>
                </div>
              ) : (
                "Create Drive"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


{/*"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(100),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters long" })
    .max(100),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .max(500),
  status: z.enum(["pending", "active", "completed"]),
  dtype: z
    .string()
    .min(2, { message: "Drive Type must be at least 2 characters long" })
    .max(50),
  startDate: z.string().min(2, { message: "Start Date is required" }),
  EndDate: z.string().min(2, { message: "End Date is required" }),
  timeInterval: z
    .string()
    .min(2, { message: "Time Interval must be at least 2 characters long" })
    .max(50),
  photos: z.array(z.instanceof(File)).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateManageForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
      setValue("photos", Array.from(selectedFiles));
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("location", data.location);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("dtype", data.dtype);
    formData.append("startDate", data.startDate);
    formData.append("EndDate", data.EndDate);
    formData.append("timeInterval", data.timeInterval);

    if (data.photos) {
      data.photos.forEach((file) => {
        formData.append("file", file);
      });
    }

    console.log("this is testing:: ", formData);
    try {
      const response = await fetch("/api/drive/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error submitting the form");
      }

      console.log("Drive created successfully");
    } catch (err: any) {
      console.log(formData);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full flex justify-center overflow-auto items-center flex-col shadow-md rounded-lg border mx-auto p-4">
      <h2 className="text-xl font-bold text-left mb-6">Create a Drive</h2>

      {/* Displaying error if exists */}
   {/*}   {error && <div className="bg-red-500 text-white p-2 mb-4">{error}</div>}

      <form className="w-full p-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title?.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location?.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register("description")} />
          {errors.description && (
            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
          )}
        </div>

        <div className="mb-4 flex gap-2 justify-start items-center">
          <Label htmlFor="status">Status</Label>
          <select
            className="p-2 rounded-md"
            id="status"
            {...register("status")}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status?.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="dtype">Drive Type</Label>
          <Input id="dtype" {...register("dtype")} />
          {errors.dtype && (
            <p className="text-red-500 text-sm">{errors.dtype?.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="startDate">Start Date</Label>
          <Input type="date" id="startDate" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate?.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="EndDate">End Date</Label>
          <Input type="date" id="EndDate" {...register("EndDate")} />
          {errors.EndDate && (
            <p className="text-red-500 text-sm">{errors.EndDate?.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="timeInterval">Time Interval</Label>
          <Input id="timeInterval" {...register("timeInterval")} />
          {errors.timeInterval && (
            <p className="text-red-500 text-sm">
              {errors.timeInterval?.message}
            </p>
          )}
        </div>

        {/* File Upload */}
    {/*}    <div className="mb-4">
          <Label htmlFor="photos">Upload Photos</Label>
          <input
            type="file"
            id="photos"
            accept="image/*"
            multiple
            onChange={onFileChange}
            className="p-2 rounded-md"
          />
          {files.length > 0 && (
            <p className="text-green-500 text-sm">
              {files.length} files selected
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Create Drive"}
        </Button>
      </form>
    </div>
  );
} */}
