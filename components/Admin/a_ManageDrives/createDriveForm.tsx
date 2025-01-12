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
  placeLink: z.string().url({ message: "Must be a valid URL" }).optional(),
  geoLocation: z
    .object({
      latitude: z.string().optional(),
      longitude: z.string().optional(),
    })
    .optional(),
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
    formData.append("placeLink", data.placeLink || "");
    formData.append("longitude", data.geoLocation?.longitude || "");
    formData.append("latitude", data.geoLocation?.latitude || "");
    console.log(formData);
    if (data.photos) {
      data.photos.forEach((file) => {
        formData.append("file", file);
      });
    }

    try {
      const response = await fetch("/api/drive/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error submitting the form");
      }
      console.log("this is dsd ", response);

      console.log("Drive created successfully");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
      <CardHeader className="space-y-1 border-b border-gray-100 bg-gray-50/40 px-8 py-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Create a Drive
        </CardTitle>
        <p className="text-sm text-gray-600">
          Fill in the details below to create a new drive
        </p>
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
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter drive title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title?.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  className="mt-1 block w-full rounded-lg"
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location?.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </Label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 min-h-[100px] p-3"
                  placeholder="Enter drive description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Drive Details */}
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700"
                >
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
                  <p className="mt-1 text-sm text-red-600">
                    {errors.status?.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="dtype"
                  className="text-sm font-medium text-gray-700"
                >
                  Drive Type
                </Label>
                <Input
                  id="dtype"
                  {...register("dtype")}
                  className="mt-1 block w-full rounded-lg"
                  placeholder="Enter drive type"
                />
                {errors.dtype && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dtype?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="startDate"
                    className="text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    id="startDate"
                    {...register("startDate")}
                    className="mt-1 block w-full rounded-lg"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startDate?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="EndDate"
                    className="text-sm font-medium text-gray-700"
                  >
                    End Date
                  </Label>
                  <Input
                    type="date"
                    id="EndDate"
                    {...register("EndDate")}
                    className="mt-1 block w-full rounded-lg"
                  />
                  {errors.EndDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.EndDate?.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="timeInterval"
                  className="text-sm font-medium text-gray-700"
                >
                  Time Interval
                </Label>
                <Input
                  id="timeInterval"
                  {...register("timeInterval")}
                  className="mt-1 block w-full rounded-lg"
                  placeholder="Enter time interval"
                />
                {errors.timeInterval && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.timeInterval?.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="placeLink"
                  className="text-sm font-medium text-gray-700"
                >
                  Place Link (Optional)
                </Label>
                <Input
                  id="placeLink"
                  {...register("placeLink")}
                  className="mt-1 block w-full rounded-lg"
                  placeholder="Enter the place URL"
                />
                {errors.placeLink && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.placeLink?.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="latitude"
                  className="text-sm font-medium text-gray-700"
                >
                  Latitude (Optional)
                </Label>
                <Input
                  type="text"
                  id="latitude"
                  {...register("geoLocation.latitude")}
                  className="mt-1 block w-full rounded-lg"
                  placeholder="Enter latitude"
                />
                {errors.geoLocation?.latitude && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.geoLocation.latitude?.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="longitude"
                  className="text-sm font-medium text-gray-700"
                >
                  Longitude (Optional)
                </Label>
                <Input
                  type="text"
                  id="longitude"
                  {...register("geoLocation.longitude")}
                  className="mt-1 block w-full rounded-lg"
                  placeholder="Enter longitude"
                />
                {errors.geoLocation?.longitude && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.geoLocation.longitude?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div>
            <Label
              htmlFor="photos"
              className="text-sm font-medium text-gray-700"
            >
              Upload Photos
            </Label>
            <input
              id="photos"
              type="file"
              {...register("photos")}
              onChange={onFileChange}
              multiple
              className="mt-1 block w-full rounded-lg"
            />
            {files.length > 0 && (
              <div className="mt-3 text-sm">
                <span className="font-medium">Files to upload:</span>
                <ul className="list-disc pl-5">
                  {files.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
