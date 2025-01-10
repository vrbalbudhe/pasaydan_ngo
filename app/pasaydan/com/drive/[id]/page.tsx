"use client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoLocation } from "react-icons/go";
import { CiCirclePlus } from "react-icons/ci";
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

        if (!response.ok) {
          throw new Error(`Failed to fetch drive: ${response.statusText}`);
        }

        const data = await response.json();
        setImagePaths(data?.photos);
        setDriveInformation(data);
        console.log(data?.photos);
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
  console.log(formattedPaths);
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-[80%] min-h-screen justify-start flex flex-col items-center md:mb-10 mb-5">
      <div className="w-full h-fit md:h-[350px] md:flex gap-5">
        <div className="w-full md:w-[45%] h-full">
          <img
            className="w-full h-[300px] rounded-md object-cover md:rounded-md"
            src={
              formattedPaths.length > 0
                ? `/${formattedPaths[0].replace("public/", "")}`
                : "https://skift.com/wp-content/uploads/2022/06/GettyImages-1208049833-scaled-e1654782364566-1024x682.jpg" // Fallback image
            }
          />
        </div>
        <div className="w-full md:w-[55%] h-fit p-2 flex flex-col">
          <div className="w-full flex-col h-1/3 gap-2 flex-wrap p-2 flex justify-center items-start">
            <p className="text-5xl font-semibold text-slate-800 tracking-tight">
              {DriveInformation?.title}
            </p>
            <div className="w-full flex flex-col justify-start gap-0.5 items-start">
              <InfoRow
                icon={GoLocation}
                text={DriveInformation?.location || "Location not available"}
              />
              <InfoRow
                icon={MdOutlineAccessTime}
                text={`${DriveInformation?.startDate || "N/A"} - ${DriveInformation?.EndDate || "N/A"}`}
              />
              <InfoRow
                icon={MdOutlineAccessTime}
                text={DriveInformation?.timeInterval || "Time not available"}
              />
              <InfoRow
                icon={MdOutlineAccessTime}
                text={DriveInformation?.dtype || "Type not specified"}
              />
            </div>
          </div>
          <div className="w-full flex-col h-fit border-2 flex-wrap rounded-2xl bg-slate-900 border-slate-200 p-5 flex justify-start items-start">
            <p className="text-sm text-slate-200">
              {DriveInformation?.description.slice(0, 250) ||
                "No description provided."}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full h-full mt-2 md:mt-5 flex flex-col gap-2">
        <div className="w-full gap-4 h-fit border-slate-300 rounded-lg flex flex-wrap md:justify-start justify-center">
          {formattedPaths?.length ? (
            formattedPaths?.map((photo, index) => (
              <div
                key={index}
                className="md:w-[350px] w-full h-[210px] shadow-sm md:hover:scale-105 duration-500 rounded-md overflow-hidden"
              >
                <img
                  src={`/${photo.replace("public/", "")}`}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="md:w-full w-[100%] ml-2 mr-2 md:mr-0 md:ml-0 h-20 border-2 flex justify-center items-center border-yellow-200 rounded-2xl bg-yellow-50">
              <p className="-tracking-tight text-slate-800 text-sm">
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
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <p className="text-sm text-slate-600 flex justify-center items-center gap-2">
    <span className="text-sm inline">
      <Icon />
    </span>
    {text}
  </p>
);
 