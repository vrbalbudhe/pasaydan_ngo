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

type ContactPerson = {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
};

type OrganizationProfile = {
  id: string;
  name: string | null;
  email: string;
  mobile: string | null;
  avatar: string | null;
  contactPerson: ContactPerson[];
  address: Address;
};

const UpdateOrgProfileForm = ({
  initialProfile,
}: {
  initialProfile: OrganizationProfile;
}) => {
  const [formData, setFormData] = useState<OrganizationProfile>({
    ...initialProfile,
    address: { ...initialProfile.address },
    contactPerson: initialProfile.contactPerson.length
      ? [...initialProfile.contactPerson]
      : [{ id: "", name: "", email: "", mobile: "" }],
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
    } else if (name.startsWith("contactPerson")) {
      const [field, index] = name.split("_");
      const idx = parseInt(index, 10);
      const updatedContactPerson = [...formData.contactPerson];
      updatedContactPerson[idx] = {
        ...updatedContactPerson[idx],
        [field]: value,
      };
      setFormData((prev) => ({
        ...prev,
        contactPerson: updatedContactPerson,
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
    formPayload.append("name", formData.name || "");
    formPayload.append("email", formData.email);
    formPayload.append("mobile", formData.mobile || "");
    formPayload.append("streetAddress", formData.address.streetAddress || "");
    formPayload.append("addressLine2", formData.address.addressLine2 || "");
    formPayload.append("city", formData.address.city || "");
    formPayload.append("state", formData.address.state || "");
    formPayload.append("postalCode", formData.address.postalCode || "");
    formPayload.append("country", formData.address.country || "");

    formData.contactPerson.forEach((contact, index) => {
      formPayload.append(`contactPersonName_${index}`, contact.name);
      formPayload.append(`contactPersonEmail_${index}`, contact.email);
      formPayload.append(`contactPersonMobile_${index}`, contact.mobile || "");
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

  const organizationFields = [
    { id: "name", label: "Organization Name", value: formData.name },
    { id: "email", label: "Organization Email", value: formData.email },
    { id: "mobile", label: "Mobile", value: formData.mobile },
  ];

  const addressFields = [
    {
      id: "streetAddress",
      label: "Street Address",
      value: formData.address.streetAddress,
    },
    {
      id: "addressLine2",
      label: "Address Line 2",
      value: formData.address.addressLine2,
    },
    { id: "city", label: "City", value: formData.address.city },
    { id: "state", label: "State", value: formData.address.state },
    {
      id: "postalCode",
      label: "Postal Code",
      value: formData.address.postalCode,
    },
    { id: "country", label: "Country", value: formData.address.country },
  ];

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
                alt={formData.name || "Organization"}
              />
            ) : (
              <AvatarFallback className="bg-primary/10">
                {formData.name ? formData.name[0] : "O"}
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
          {organizationFields.map(({ id, label, value, ...props }) => (
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

          {formData.contactPerson.map((contact, index) => (
            <div key={`contactPerson_${index}`}>
              <div>
                <Label htmlFor={`contactPersonName_${index}`}>
                  Contact Person Name
                </Label>
                <Input
                  id={`contactPersonName_${index}`}
                  name={`name_${index}`}
                  value={contact.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor={`contactPersonEmail_${index}`}>
                  Contact Person Email
                </Label>
                <Input
                  id={`contactPersonEmail_${index}`}
                  name={`email_${index}`}
                  value={contact.email || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor={`contactPersonMobile_${index}`}>
                  Contact Person Mobile
                </Label>
                <Input
                  id={`contactPersonMobile_${index}`}
                  name={`mobile_${index}`}
                  value={contact.mobile || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          ))}

          {addressFields.map(({ id, label, value, ...props }) => (
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

export default UpdateOrgProfileForm;
