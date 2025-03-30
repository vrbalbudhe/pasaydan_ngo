"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoLocation, GoCalendar, GoLinkExternal } from "react-icons/go";
import { MdOutlineAccessTime, MdCategory } from "react-icons/md";
import Image from "next/image";
import { useToast } from "hooks/use-toast"; // Corrected import
import { Badge } from "components/ui/badge"; // Corrected import
import AddParticipants from "./addParticipants";

interface GeoLocation {
  latitude: string;
  longitude: string;
}

interface Drive {
  id: string;
  title: string;
  location: string;
  startDate: string;
  EndDate: string; // Changed from EndDate to endDate
  description: string;
  status: string;
  dtype: string;
  timeInterval: string;
  photos: string[];
  placeLink?: string;
  geoLocation?: GeoLocation;
  createdAt: string;
}

interface ParticipantsImg {
  id: string;
  url: string;
}

type UserProfile = {
  id: string;
  fullname: string | null;
  email: string;
  userType: string;
  address: string | null;
  avatar: string | null;
  mobile: string | null;
  createdAt: string | null;
};

// Info Card Component
const InfoCard: React.FC<{
  icon: React.ElementType;
  title: string;
  content: string;
  link?: string;
}> = ({ icon: Icon, title, content, link }) => {
  return (
    <div className="rounded-md border  flex bg-white p-4 shadow-sm border-gray-200 hover:bg-gray-200">
      <div className="w-[20%] flex justify-center text-[200px] items-center">
        <Icon className="h-10 w-10 text-blue-400 " />
      </div>
      <div className="w-[80%] h-full">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-2xl text-gray-700">{title}</h3>
        </div>
        <p className=" text-xs text-gray-700">{content}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            View on Map <GoLinkExternal className="ml-1" />
          </a>
        )}
      </div>
    </div>
  );
};

export default function DriveInfo() {
  const { id } = useParams() as { id: string };
  const [drive, setDrive] = useState<Drive | null>(null);
  const [participantsImage, setParticipantsImage] = useState<
    ParticipantsImg[] | null
  >(null); // Store an array

  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const { toast } = useToast();

  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();
        setUser(data?.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchDrive = async () => {
    try {
      const response = await fetch(`/api/drive/${id}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);
      // console.log("this is check L", result);
      setDrive(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch drive details",
      });
    } finally {
      setLoading(false);
    }
  };
  // Inside fetchParticipantsImages function
  const fetchParticipantsImages = async () => {
    try {
      const response = await fetch(`/api/drive/participants/${id}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      // Set images from result.images array
      setParticipantsImage(result.images);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch participants' images",
      });
    }
  };

  useEffect(() => {
    fetchDrive();
    fetchParticipantsImages();

    const interval = setInterval(fetchDrive, 30000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Drive Not Found</h2>
          <p className="mt-2 text-gray-600">
            The drive you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-fit w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img
            src={drive.photos[1] || "/placeholder-image.jpg"}
            alt={drive.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto h-full px-4">
            <div className="flex h-full md:pl-16 pl-5 flex-col justify-end pb-16">
              <h1 className="text-4xl font-medium text-left text-gray-200 md:text-6xl">
                {drive.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  className="text-gray-800 py-2 -tracking-tighter text-lg"
                  variant={
                    drive.status === "active"
                      ? "default"
                      : drive.status === "completed"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {drive.status.toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-gray-900 bg-white px-2 -tracking-tighter text-xl"
                >
                  {drive.dtype}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container w-[90%] mx-auto px-4 py-12">
        <div className="w-full h-full flex flex-col-reverse md:flex-row gap-5">
          {/* Left Column - Details */}
          <div className="md:w-[70%] h-fit text-wrap">
            <section className="rounded-lg mb-4 bg-white shadow-sm">
              <h2 className=" text-4xl md:text-5xl font-medium mb-5 tracking-tight text-gray-700">
                Details
              </h2>
              <p className="text-gray-600 text-md font-normal -tracking-tight">
                {drive.description}
              </p>
            </section>

            {/* Image Gallery */}
            <section className="px-4 lg:px-20 py-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                {drive.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="w-full rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setActiveImage(photo)}
                  >
                    <img
                      src={photo}
                      alt={`Drive photo ${index + 1}`}
                      className="w-full h-40 md:h-56 lg:h-64 object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {participantsImage?.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square h-32 md:h-40 lg:h-48 w-full rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setActiveImage(photo.url)}
                  >
                    <img
                      src={photo.url}
                      alt={`Participant photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Info Cards */}
          <div className="md:w-[30%] flex gap-3 flex-col">
            {user?.id === "67896357a0f50f59fa5f7044" && <AddParticipants />}
            <InfoCard
              icon={GoCalendar}
              title="Dates"
              content={`${drive.startDate} - ${drive.EndDate}`}
            />
            <InfoCard
              icon={MdOutlineAccessTime}
              title="Time"
              content={drive.timeInterval}
            />
            <InfoCard
              icon={GoLocation}
              title="Location"
              content={drive.location}
              link={drive.placeLink}
            />
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveImage(null)}
        >
          <img
            src={activeImage}
            alt="Enlarged drive photo"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
}
