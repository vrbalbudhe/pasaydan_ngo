"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface Drive {
  id: string;
  title: string;
  location: string;
  description: string;
  status: string;
  dtype: string;
  startDate: string;
  EndDate: string;
  timeInterval: string;
  photos: string[];
}

export default function DriveUpdatePage() {
  const [drive, setDrive] = useState<Drive | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Drive>();

  useEffect(() => {
    if (!id) return;
    const fetchDrive = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/drive/${id}`);
        if (!response.ok) throw new Error("Failed to fetch drive details");
        const data = await response.json();
        setDrive(data);
        setImagePaths(data?.photos);
        Object.keys(data).forEach((key) =>
          setValue(key as keyof Drive, data[key])
        );
      } catch (err: any) {
        setError(err.message || "Error fetching drive details");
      } finally {
        setLoading(false);
      }
    };

    fetchDrive();
  }, [id, setValue]);

  const onSubmit = async (formData: Drive) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/drive/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update drive");
      alert("Drive updated successfully!");
      router.push("/pasaydan/admin/drives");
    } catch (err: any) {
      setError(err.message || "Error updating drive");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && drive) {
      const newPhotos = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setDrive({ ...drive, photos: [...drive.photos, ...newPhotos] });
    }
  };

  const formattedPaths = imagePaths.map((path) => path.replace(/\\/g, "/"));
  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Update Drive</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-8"
      >
        {/* Left Column - Input Fields */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              {...register("location", { required: "Location is required" })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.location && (
              <span className="text-red-500 text-sm">
                {errors.location.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full border border-gray-300 rounded-md p-2"
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.startDate && (
              <span className="text-red-500 text-sm">
                {errors.startDate.message}
              </span>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              {...register("EndDate", { required: "End date is required" })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.EndDate && (
              <span className="text-red-500 text-sm">
                {errors.EndDate.message}
              </span>
            )}
          </div>

          {/* Time Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time Interval
            </label>
            <input
              type="text"
              {...register("timeInterval", {
                required: "Time interval is required",
              })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.timeInterval && (
              <span className="text-red-500 text-sm">
                {errors.timeInterval.message}
              </span>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              {...register("status", { required: "Status is required" })}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <span className="text-red-500 text-sm">
                {errors.status.message}
              </span>
            )}
          </div>

          {/* Donation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Donation Type
            </label>
            <input
              type="text"
              {...register("dtype", { required: "Donation type is required" })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.dtype && (
              <span className="text-red-500 text-sm">
                {errors.dtype.message}
              </span>
            )}
          </div>
        </div>

        {/* Right Column - Images */}
        <div className="space-y-4">
          {/* Existing Photos */}
          <div>
            <label className="block text-sm mb-3 font-medium text-gray-700">
              Photos
            </label>
            <div className="w-full h-full flex flex-wrap gap-2">
              {formattedPaths?.map((photo, index) => (
                <img
                  key={index}
                  src={`/${photo.replace("public/", "")}`}
                  alt={`Photo ${photo}`}
                  className="w-32 h-32 object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Upload New Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload New Photos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full rounded-md p-2"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="col-span-2 w-fit bg-blue-500 text-white"
        >
          Update Drive
        </Button>
      </form>
    </div>
  );
}
