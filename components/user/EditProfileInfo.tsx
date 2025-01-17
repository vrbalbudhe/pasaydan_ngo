"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Address = {
  streetAddress: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
};

type UserProfile = {
  id: string;
  fullname: string | null;
  email: string;
  mobile: string | null;
  avatar: string | null;
  userType: string;
  address: Address;
};

const UpdateProfileForm = ({
  initialProfile,
}: {
  initialProfile: UserProfile;
}) => {
  const [formData, setFormData] = useState<UserProfile>({
    ...initialProfile,
    address: { ...initialProfile.address },
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name in formData.address) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    formPayload.append("mobile", formData.mobile || "");
    formPayload.append("streetAddress", formData.address.streetAddress || "");
    formPayload.append("addressLine2", formData.address.addressLine2 || "");
    formPayload.append("city", formData.address.city || "");
    formPayload.append("state", formData.address.state || "");
    formPayload.append("postalCode", formData.address.postalCode || "");
    formPayload.append("country", formData.address.country || "");
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
        className="border-2 rounded-lg p-6 md:flex gap-10 w-[100%] max-w-4xl"
      >
        <div className="flex h-full md:w-1/3 flex-col gap-6 items-center">
          <Avatar className="h-32 w-32 border border-slate-200">
            {formData.avatar ? (
              <AvatarImage
                src={formData.avatar || ""}
                alt={formData.fullname || "User"}
              />
            ) : (
              <AvatarFallback className="bg-primary/10">
                {formData.fullname ? formData.fullname[0] : "U"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex flex-col">
            <Label htmlFor="avatar" className="text-slate-800 p-2">
              Choose Avatar
            </Label>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              className="text-slate-800"
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

        <div className="mt-10 md:mt-0 md:w-2/3 space-y-4 text-slate-800 text-sm">
          {/* Non-address fields */}
          {[
            {
              id: "fullname",
              label: "Full Name",
              placeholder: "Enter your full name",
              required: true,
              value: formData.fullname,
            },
            {
              id: "email",
              label: "Email",
              type: "email",
              required: true,
              disabled: true,
              value: formData.email,
            },
            {
              id: "mobile",
              label: "Mobile",
              type: "tel",
              placeholder: "Enter your mobile number",
              value: formData.mobile,
            },
          ].map(({ id, label, value, ...props }) => (
            <div key={id}>
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                name={id}
                value={value || ""}
                onChange={handleChange}
                {...props}
              />
            </div>
          ))}

          {/* Address fields */}
          {[
            {
              id: "streetAddress",
              label: "Street Address",
              placeholder: "Enter your street address",
              value: formData.address.streetAddress,
            },
            {
              id: "addressLine2",
              label: "Address Line 2",
              placeholder: "Enter additional address details",
              value: formData.address.addressLine2,
            },
            {
              id: "city",
              label: "City",
              placeholder: "Enter your city",
              value: formData.address.city,
            },
            {
              id: "state",
              label: "State",
              placeholder: "Enter your state",
              value: formData.address.state,
            },
            {
              id: "postalCode",
              label: "Postal Code",
              placeholder: "Enter your postal code",
              value: formData.address.postalCode,
            },
            {
              id: "country",
              label: "Country",
              placeholder: "Enter your country",
              value: formData.address.country,
            },
          ].map(({ id, label, value, ...props }) => (
            <div key={id}>
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                name={id}
                value={value || ""}
                onChange={handleChange}
                {...props}
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
