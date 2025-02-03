"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Address = {
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type UserProfile = {
  id: string;
  fullname: string;
  email: string;
  mobile: string;
  avatar: string;
  userType: string;
  address: Address;
};

const UpdateProfileForm = ({
  initialProfile,
}: {
  initialProfile: UserProfile;
}) => {
  // Separate state for non-address and address fields for clarity and easier updates.
  const [profileData, setProfileData] = useState({
    fullname: initialProfile.fullname || "",
    email: initialProfile.email,
    mobile: initialProfile.mobile || "",
    avatar: initialProfile.avatar || "",
  });

  const [addressData, setAddressData] = useState({
    streetAddress: initialProfile.address?.streetAddress || "",
    addressLine2: initialProfile.address?.addressLine2 || "",
    city: initialProfile.address?.city || "",
    state: initialProfile.address?.state || "",
    postalCode: initialProfile.address?.postalCode || "",
    country: initialProfile.address?.country || "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
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
    formPayload.append("fullname", profileData.fullname);
    formPayload.append("email", profileData.email);
    formPayload.append("mobile", profileData.mobile);
    formPayload.append("streetAddress", addressData.streetAddress);
    formPayload.append("addressLine2", addressData.addressLine2);
    formPayload.append("city", addressData.city);
    formPayload.append("state", addressData.state);
    formPayload.append("postalCode", addressData.postalCode);
    formPayload.append("country", addressData.country);
    if (avatarFile) {
      formPayload.append("avatar", avatarFile);
    }

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        body: formPayload,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setProfileData((prev) => ({
          ...prev,
          avatar: data.avatar || prev.avatar,
        }));
      } else {
        toast.error("Failed to update profile. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <div className="flex items-start justify-center w-full">
        <form
          onSubmit={handleSubmit}
          className="border-2 rounded-lg p-6 md:flex gap-10 w-[100%] max-w-4xl"
        >
          <div className="flex h-full md:w-1/3 flex-col gap-6 items-center">
            <Avatar className="h-32 w-32 border border-slate-200">
              {profileData.avatar ? (
                <AvatarImage
                  src={profileData.avatar}
                  alt={profileData.fullname || "User"}
                />
              ) : (
                <AvatarFallback className="bg-primary/10">
                  {profileData.fullname ? profileData.fullname[0] : "U"}
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
            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                value={profileData.fullname}
                onChange={handleProfileChange}
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
                value={profileData.email}
                onChange={handleProfileChange}
                disabled
                required
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                value={profileData.mobile}
                onChange={handleProfileChange}
                placeholder="Enter your mobile number"
              />
            </div>

            {/* Address fields */}
            <div>
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                value={addressData.streetAddress}
                onChange={handleAddressChange}
                placeholder="Enter your street address"
              />
            </div>
            <div>
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                name="addressLine2"
                value={addressData.addressLine2}
                onChange={handleAddressChange}
                placeholder="Enter additional address details"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={addressData.city}
                onChange={handleAddressChange}
                placeholder="Enter your city"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={addressData.state}
                onChange={handleAddressChange}
                placeholder="Enter your state"
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={addressData.postalCode}
                onChange={handleAddressChange}
                placeholder="Enter your postal code"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={addressData.country}
                onChange={handleAddressChange}
                placeholder="Enter your country"
              />
            </div>
          </div>
        </form>
      </div>
      <ToastContainer theme="colored" />
    </>
  );
};

export default UpdateProfileForm;
