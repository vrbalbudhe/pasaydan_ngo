"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UserProfile = {
  id: string;
  fullname: string | null;
  email: string;
  address: string | null;
  avatar: string | null;
  mobile: string | null;
};

const UpdateProfileForm = ({
  initialProfile,
}: {
  initialProfile: UserProfile;
}) => {
  const [formData, setFormData] = useState<UserProfile>(initialProfile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("fullname", formData.fullname || "");
    formPayload.append("email", formData.email);
    formPayload.append("address", formData.address || "");
    formPayload.append("mobile", formData.mobile || "");
    if (avatarFile) formPayload.append("avatar", avatarFile);

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        body: formPayload,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        alert("Profile updated successfully");
        setFormData((prev) => ({
          ...prev,
          avatar: data.avatar || prev.avatar,
        }));
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex items-start justify-center w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-[#2d232e] rounded-md  p-6 md:flex gap-10 w-[100%] max-w-4xl"
      >
        <div className="flex h-full md:w-1/3 flex-col gap-6 items-center">
          <Avatar className="h-32 w-32 border border-slate-200">
            {formData.avatar ? (
              <AvatarImage
                src={formData.avatar || "User"}
                alt={formData.fullname || "User"}
              />
            ) : (
              <AvatarFallback className="bg-primary/10">
                {formData.fullname ? formData.fullname[0] : "U"}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Avatar upload input */}
          <div className="flex flex-col">
            <Label htmlFor="avatar" className="text-white p-2">
              Choose Avatar
            </Label>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              className="text-white"
              onChange={handleAvatarChange}
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-6 bg-white hover:bg-slate-500 text-slate-800"
          >
            Update Profile
          </Button>
        </div>

        <div className="mt-10 md:mt-0 md:w-2/3 space-y-4 text-white text-sm">
          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              name="fullname"
              value={formData.fullname || ""}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled // Freezes the email field
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              value={formData.mobile || ""}
              onChange={handleChange}
              placeholder="Enter your mobile number"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
