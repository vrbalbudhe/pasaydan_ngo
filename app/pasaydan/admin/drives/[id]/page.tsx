"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; 
import { Loader2, X } from "lucide-react";

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
  placeLink?: string;
  geoLocation?: {
    latitude: string;
    longitude: string;
  };
}

export default function DriveUpdatePage() {
  const [drive, setDrive] = useState<Drive | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { toast } = useToast();

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
        setImagePaths(data?.photos || []);
        Object.keys(data).forEach((key) =>
          setValue(key as keyof Drive, data[key])
        );
      } catch (err: any) {
        setError(err.message || "Error fetching drive details");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch drive details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDrive();
  },  [id, setValue, toast]);

  const onSubmit = async (formData: Drive) => {
    try {
      setLoading(true);
      const submitFormData = new FormData();

      // Append basic fields
      submitFormData.append('title', formData.title);
      submitFormData.append('location', formData.location);
      submitFormData.append('description', formData.description);
      submitFormData.append('status', formData.status);
      submitFormData.append('dtype', formData.dtype);
      submitFormData.append('startDate', formData.startDate);
      submitFormData.append('EndDate', formData.EndDate);
      submitFormData.append('timeInterval', formData.timeInterval);

      // Handle geoLocation
      if (formData.geoLocation?.latitude && formData.geoLocation?.longitude) {
        submitFormData.append('geoLocation', JSON.stringify({
          latitude: formData.geoLocation.latitude,
          longitude: formData.geoLocation.longitude
        }));
      }

      // Handle placeLink
      if (formData.placeLink) {
        submitFormData.append('placeLink', formData.placeLink);
      }

      // Append existing photos
      submitFormData.append('existingPhotos', JSON.stringify(imagePaths));

      // Append new files
      newFiles.forEach(file => {
        submitFormData.append('newPhotos', file);
      });

      const response = await fetch(`/api/drive/update/${id}`, {
        method: "PUT",
        body: submitFormData,
      });


      if (!response.ok) throw new Error("Failed to update drive");
      
      toast({
        title: "Success",
        description: "Drive updated successfully"
      });

      router.push("/pasaydan/admin/drives");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Error updating drive");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update drive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Validate files
    const validFiles = Array.from(files).filter(file => {
      const isValid = file.type.startsWith('image/');
      const isUnderSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValid || !isUnderSize) {
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: `${file.name} is ${!isValid ? 'not an image' : 'too large (max 5MB)'}`
        });
        return false;
      }
      return true;
    });

    setNewFiles(prev => [...prev, ...validFiles]);
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index: number) => {
    setImagePaths(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Update Drive</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-8">
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
              className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
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
              <option value="active">Active</option>
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
              placeholder="e.g., 9:00 AM - 5:00 PM"
            />
            {errors.timeInterval && (
              <span className="text-red-500 text-sm">
                {errors.timeInterval.message}
              </span>
            )}
          </div>

          {/* Optional Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Place Link (Optional)
            </label>
            <input
              type="url"
              {...register("placeLink")}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter Google Maps URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Latitude (Optional)
              </label>
              <input
                type="text"
                {...register("geoLocation.latitude")}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g., 12.9716"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitude (Optional)
              </label>
              <input
                type="text"
                {...register("geoLocation.longitude")}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g., 77.5946"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Images */}
        <div className="space-y-6">
          {/* Existing Photos */}
          <div>
            <label className="block text-sm mb-3 font-medium text-gray-700">
              Current Photos
            </label>
            <div className="grid grid-cols-2 gap-4">
              {imagePaths.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Drive photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* New Photos Preview */}
          {newFiles.length > 0 && (
            <div>
              <label className="block text-sm mb-3 font-medium text-gray-700">
                New Photos to Upload
              </label>
              <div className="grid grid-cols-2 gap-4">
                {newFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              className="w-full rounded-md p-2 border border-gray-300 mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum 5MB per image. Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-500 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Drive"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}