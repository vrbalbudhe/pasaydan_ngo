"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoLocation, GoCalendar, GoLinkExternal } from "react-icons/go";
import { MdOutlineAccessTime, MdCategory } from "react-icons/md";
import Image from "next/image";
import { useToast } from "hooks/use-toast"; // Corrected import
import { Badge } from "components/ui/badge"; // Corrected import

interface GeoLocation {
  latitude: string;
  longitude: string;
}

interface Drive {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string; // Changed from EndDate to endDate
  description: string;
  status: string;
  dtype: string;
  timeInterval: string;
  photos: string[];
  placeLink?: string;
  geoLocation?: GeoLocation;
  createdAt: string;
}

// Info Card Component
const InfoCard: React.FC<{
  icon: React.ElementType;
  title: string;
  content: string;
  link?: string;
}> = ({ icon: Icon, title, content, link }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="mt-2 text-gray-700">{content}</p>
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
  );
};

export default function DriveInfo() {
  const { id } = useParams() as { id: string };
  const [drive, setDrive] = useState<Drive | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const { toast } = useToast();

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
        description: error instanceof Error ? error.message : "Failed to fetch drive details"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrive();

    // Set up polling for real-time updates
    const interval = setInterval(fetchDrive, 30000); // Poll every 30 seconds

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
          <p className="mt-2 text-gray-600">The drive you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img
            src={drive.photos[0] || '/placeholder-image.jpg'}
            alt={drive.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto h-full px-4">
            <div className="flex h-full flex-col justify-end pb-16">
              <h1 className="text-4xl font-bold text-white md:text-6xl">
                {drive.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant={
                  drive.status === 'active' ? 'default' :
                    drive.status === 'completed' ? 'secondary' : 'outline'
                }>
                  {drive.status.toUpperCase()}
                </Badge>
                <Badge variant="outline">{drive.dtype}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-8">
            <section className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">About This Drive</h2>
              <p className="text-gray-700 leading-relaxed">{drive.description}</p>
            </section>

            {/* Image Gallery */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Photos</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {drive.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => setActiveImage(photo)}
                  >
                    <img
                      src={photo}
                      alt={`Drive photo ${index + 1}`}
                      className="h-full w-full object-cover transition-transform hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            <InfoCard
              icon={GoCalendar}
              title="Dates"
              content={`${drive.startDate} - ${drive.endDate}`} // Updated to endDate
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
            {drive.geoLocation && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="aspect-video w-full">
                  {/* Add your map component here if needed */}
                </div>
              </div>
            )}
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
