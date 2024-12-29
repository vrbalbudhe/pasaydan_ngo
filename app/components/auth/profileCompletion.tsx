"use client";
import React, { useState } from "react";
import { Camera, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileCompletion = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    Address: "",
    bio: "",
    skills: "",
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push("/"); // Redirect to home page after 2 seconds
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="h-full bg-gray-50 absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(to_bottom,white,transparent)] flex items-center justify-center p-4">
        <Alert>
          <AlertDescription>
            Profile successfully completed! Redirecting to homepage...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full w-[100%] py-12 px-4 md:flex justify-center items-start gap-20">
      <div className="md:w-1/3 w-full h-fit pt-10 pb-10 md:pt-0 md:pb-10 md:min-h-screen flex flex-col justify-center items-center gap-10">
        <p className="text-3xl text-center">
          Pasaydan provides a
          <span className="font-semibold text-5xl text-blue-600"> cycles</span>,
          <span className="text-5xl font-semibold text-blue-600">
            {" "}
            Blankets{" "}
          </span>
          and
          <span className="font-semibold text-5xl text-blue-600"> more.. </span>
          to the poor people,
        </p>
        <p className="text-md text-slate-700">
          Join Us & Be the part of our Pasaydaan
        </p>
      </div>
      <Card className="max-w-xl w-full shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-gray-600">
            Help us understand how you want to contribute to our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8 flex flex-col items-center">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-gray-200 rounded-full">
                <AvatarImage src={imagePreview || ""} />
                <AvatarFallback>
                  <Camera className="h-8 w-8 text-gray-500" />
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Upload className="h-6 w-6 text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <span className="mt-2 text-sm text-gray-500">
              Click to upload profile picture
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 ">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">First Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                  className="focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel"
                placeholder="Enter your phone number"
                className="focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="Enter your phone number"
                className="focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Address">Address</Label>
              <Input
                id="Address"
                name="Address"
                value={formData.Address}
                onChange={handleInputChange}
                placeholder="e.g., hinjewadi, pune"
                className="focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/")} // Use router for navigation
                className="text-gray-600 border-gray-400 hover:bg-gray-100"
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Complete Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;
