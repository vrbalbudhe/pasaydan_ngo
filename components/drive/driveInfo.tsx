"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoLocation } from "react-icons/go";
import { MdOutlineAccessTime } from "react-icons/md";

interface Drive {
  id: string;
  title: string;
  location: string;
  startDate: string;
  EndDate: string;
  description: string;
  dtype: string;
  timeInterval: string;
  photos?: string[];
}

export default function DriveInfo() {
  const { id } = useParams() as { id: string };
  const [DriveInformation, setDriveInformation] = useState<Drive | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  useEffect(() => {
    const fetchDrive = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/drive/${id}`);
        if (!response.ok)
          throw new Error(`Failed to fetch drive: ${response.statusText}`);
        const data = await response.json();
        setImagePaths(data?.photos);
        setDriveInformation(data);
        console.log(data);
      } catch (error: any) {
        setError(
          error.message || "An error occurred while fetching the drive."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDrive();
  }, [id]);

  const formattedPaths = imagePaths.map((path) => path.replace(/\\/g, "/"));

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[90%] px-4 py-8">
      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg shadow-sm">
          <img
            className="h-[400px] w-full object-cover transition duration-500 hover:scale-105"
            src={
              formattedPaths.length > 0
                ? `/${formattedPaths[0].replace("public/", "")}`
                : "https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg"
            }
            alt={DriveInformation?.title}
          />
        </div>

        <div className="flex flex-col justify-between space-y-6 p-4">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">
              {DriveInformation?.title}
            </h1>

            <div className="space-y-2">
              <InfoRow
                icon={GoLocation}
                text={DriveInformation?.location || "Location not available"}
                iconClass="text-blue-500"
              />
              <InfoRow
                icon={MdOutlineAccessTime}
                text={`${DriveInformation?.startDate || "N/A"} - ${DriveInformation?.EndDate || "N/A"}`}
                iconClass="text-green-500"
              />
              <InfoRow
                icon={MdOutlineAccessTime}
                text={DriveInformation?.timeInterval || "Time not available"}
                iconClass="text-purple-500"
              />
              <InfoRow
                icon={MdOutlineAccessTime}
                text={DriveInformation?.dtype || "Type not specified"}
                iconClass="text-orange-500"
              />
            </div>
          </div>

          <div className="rounded-md bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-lg">
            <p className="text-slate-200">
              {DriveInformation?.description.slice(0, 250) ||
                "No description provided."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Photo Gallery</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {formattedPaths?.length ? (
            formattedPaths?.map((photo, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg"
              >
                <img
                  src={`/${photo.replace("public/", "")}`}
                  alt={`Photo ${index + 1}`}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 transition duration-300 group-hover:bg-opacity-20"></div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl bg-yellow-50 p-8 text-center">
              <p className="text-lg font-medium text-yellow-800">
                No Photos Available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({
  icon: Icon,
  text,
  iconClass,
}: {
  icon: React.ElementType;
  text: string;
  iconClass?: string;
}) => (
  <div className="flex items-center space-x-2 text-slate-600">
    <Icon className={`text-lg ${iconClass}`} />
    <span className="text-sm font-medium">{text}</span>
  </div>
);
