"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the Zod schema for validation
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
  photos: z.array(z.instanceof(File)).optional(), // Array of files for photo upload
});

type FormData = z.infer<typeof formSchema>;

export default function CreateManageForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]); // Track the uploaded files

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
      setValue("photos", Array.from(selectedFiles)); // Set file values in the form
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
    <div className="max-w-xl w-full flex justify-center items-center flex-col shadow-md rounded-lg border mx-auto p-4">
      <h2 className="text-xl font-bold text-center mb-6">Create a Drive</h2>

      {/* Displaying error if exists */}
      {error && <div className="bg-red-500 text-white p-2 mb-4">{error}</div>}

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
        <div className="mb-4">
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
}
