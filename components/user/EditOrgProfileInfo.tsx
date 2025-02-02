"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Address = {
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type ContactPerson = {
  id: string;
  name: string;
  email: string;
  mobile: string;
};

type OrganizationProfile = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatar: string;
  contactPerson: ContactPerson[];
  address: Address;
};

const UpdateOrgProfileForm = ({
  initialProfile,
}: {
  initialProfile: OrganizationProfile;
}) => {
  // Separate state for organization, address, and contact persons
  const [orgData, setOrgData] = useState({
    name: initialProfile.name || "",
    email: initialProfile.email || "",
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

  const [contactPersons, setContactPersons] = useState<ContactPerson[]>(
    initialProfile.contactPerson.length > 0
      ? initialProfile.contactPerson.map((contact) => ({
          id: contact.id,
          name: contact.name || "",
          email: contact.email || "",
          mobile: contact.mobile || "",
        }))
      : [{ id: "", name: "", email: "", mobile: "" }]
  );

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Update organization fields
  const handleOrgChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrgData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update address fields
  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update individual contact person fields using index and field name
  const handleContactChange = (
    index: number,
    field: keyof ContactPerson,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setContactPersons((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handle avatar file changes
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("name", orgData.name);
    formPayload.append("email", orgData.email);
    formPayload.append("mobile", orgData.mobile);
    formPayload.append("streetAddress", addressData.streetAddress);
    formPayload.append("addressLine2", addressData.addressLine2);
    formPayload.append("city", addressData.city);
    formPayload.append("state", addressData.state);
    formPayload.append("postalCode", addressData.postalCode);
    formPayload.append("country", addressData.country);

    contactPersons.forEach((contact, index) => {
      formPayload.append(`contactPersonName_${index}`, contact.name);
      formPayload.append(`contactPersonEmail_${index}`, contact.email);
      formPayload.append(`contactPersonMobile_${index}`, contact.mobile);
    });

    if (avatarFile) formPayload.append("avatar", avatarFile);

    try {
      const res = await fetch("/api/org/update", {
        method: "POST",
        body: formPayload,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        setOrgData((prev) => ({
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
            {orgData.avatar ? (
              <AvatarImage src={orgData.avatar} alt={orgData.name || "Organization"} />
            ) : (
              <AvatarFallback className="bg-primary/10">
                {orgData.name ? orgData.name[0] : "O"}
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
          {/* Organization fields */}
          <div>
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              name="name"
              value={orgData.name}
              onChange={handleOrgChange}
              placeholder="Enter organization name"
            />
          </div>
          <div>
            <Label htmlFor="email">Organization Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={orgData.email}
              onChange={handleOrgChange}
              placeholder="Enter organization email"
            />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              value={orgData.mobile}
              onChange={handleOrgChange}
              placeholder="Enter mobile number"
            />
          </div>

          {/* Contact Person fields */}
          {contactPersons.map((contact, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div>
                <Label htmlFor={`contactPersonName_${index}`}>
                  Contact Person Name
                </Label>
                <Input
                  id={`contactPersonName_${index}`}
                  value={contact.name}
                  onChange={(e) => handleContactChange(index, "name", e)}
                  placeholder="Enter contact person name"
                />
              </div>
              <div>
                <Label htmlFor={`contactPersonEmail_${index}`}>
                  Contact Person Email
                </Label>
                <Input
                  id={`contactPersonEmail_${index}`}
                  value={contact.email}
                  onChange={(e) => handleContactChange(index, "email", e)}
                  placeholder="Enter contact person email"
                />
              </div>
              <div>
                <Label htmlFor={`contactPersonMobile_${index}`}>
                  Contact Person Mobile
                </Label>
                <Input
                  id={`contactPersonMobile_${index}`}
                  value={contact.mobile}
                  onChange={(e) => handleContactChange(index, "mobile", e)}
                  placeholder="Enter contact person mobile"
                />
              </div>
            </div>
          ))}

          {/* Address fields */}
          <div>
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              name="streetAddress"
              value={addressData.streetAddress}
              onChange={handleAddressChange}
              placeholder="Enter street address"
            />
          </div>
          <div>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              value={addressData.addressLine2}
              onChange={handleAddressChange}
              placeholder="Enter address line 2"
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={addressData.city}
              onChange={handleAddressChange}
              placeholder="Enter city"
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              value={addressData.state}
              onChange={handleAddressChange}
              placeholder="Enter state"
            />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={addressData.postalCode}
              onChange={handleAddressChange}
              placeholder="Enter postal code"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={addressData.country}
              onChange={handleAddressChange}
              placeholder="Enter country"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrgProfileForm;
