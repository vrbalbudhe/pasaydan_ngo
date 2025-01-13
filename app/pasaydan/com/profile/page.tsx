"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  User,
  Loader2,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import UpdateProfileForm from "@/components/user/EditProfileInfo";
import UpdateOrgProfileForm from "@/components/user/EditOrgProfileInfo";

type UserProfile = {
  id: string;
  fullname: string | null;
  email: string;
  address: string | null;
  avatar: string | null;
  mobile: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  orgId: string | null;
  streetAddress?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  country: string | null;
  state?: string | null;
  postalCode?: string | null;
  addressId: string | null;
};

type Address = {
  streetAddress?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

type OrgProfile = {
  id: string | null;
  orgId: string | null;
  name: string | null;
  email: string | null;
  contactPerson: string | null;
  address: string | Address | null;
  avatar: string | null;
  mobile: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

function isUserProfile(
  profile: UserProfile | OrgProfile
): profile is UserProfile {
  return (profile as UserProfile).fullname !== undefined;
}

const formatDate = (date: string | null): string => {
  if (!date) return "Not available";
  return new Date(date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getInitials = (name: string | null): string => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const fetchUserProfileData = async (
  email: string | null
): Promise<UserProfile | OrgProfile | null> => {
  if (!email) return null;
  try {
    const res = await fetch(`/api/user/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    console.log(data);
    return data?.user || data?.org || null;
  } catch (error) {
    console.error("Failed to fetch user profile data:", error);
    return null;
  }
};

export default function Profile() {
  const [editForm, setEditForm] = useState(false);
  const [userProfile, setUserProfile] = useState<
    UserProfile | OrgProfile | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();
        if (res.ok && data?.user) {
          const userProfileData = await fetchUserProfileData(data?.user?.email);
          setUserProfile({ ...data.user, ...userProfileData });
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/pasaydan/auth/logsign");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  const renderAddress = () => {
    if (isUserProfile(userProfile)) {
      if (typeof userProfile.address === "string") {
        return <div>{userProfile.address}</div>;
      }

      if (userProfile.address && typeof userProfile.address === "object") {
        const {
          streetAddress,
          addressLine2,
          city,
          state,
          postalCode,
          country,
        } = userProfile.address;
        return (
          <>
            {streetAddress && <div>{streetAddress}</div>}
            {addressLine2 && <div>{addressLine2}</div>}
            {city && <div>{city}</div>}
            {state && <div>{state}</div>}
            {postalCode && <div>{postalCode}</div>}
            {country && <div>{country}</div>}
          </>
        );
      }
    }
    return <div>{"Address not available"}</div>;
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-[90%] mx-auto p-8">
        {/* Header Card */}
        <Card className="border-none shadow-none mb-4">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Avatar className="h-32 w-32 ring-4 ring-gray-100">
                {userProfile.avatar ? (
                  <AvatarImage
                    src={userProfile.avatar}
                    alt={
                      isUserProfile(userProfile)
                        ? userProfile.fullname || "User"
                        : userProfile.name || "Organization"
                    }
                  />
                ) : (
                  <AvatarFallback>
                    {isUserProfile(userProfile)
                      ? getInitials(userProfile.fullname)
                      : getInitials(userProfile.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-700">
                  {isUserProfile(userProfile)
                    ? userProfile.fullname
                    : userProfile.name || "Anonymous User"}
                </h1>
                <p className="text-md text-gray-600">{userProfile.email}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setEditForm(!editForm)}
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editForm ? "Close" : "Edit Profile"}
                </Button>
                <Button onClick={handleLogout}>
                  <MdLogout className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="w-[100%] flex gap-2">
          <div className="w-[30%] flex flex-col gap-2">
            <Card className="">
              <CardHeader>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>{userProfile.email || "Not available"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span>{userProfile.mobile || "Not available"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Member Since</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span>{formatDate(userProfile.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>{renderAddress()}</CardContent>
            </Card>

            {userProfile.orgId && (
              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gray-500" />
                    <span>{userProfile.orgId}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="w-[70%]">
            {!userProfile?.orgId && editForm && (
              <UpdateProfileForm initialProfile={userProfile as UserProfile} />
            )}
            {userProfile?.orgId && editForm && (
              <UpdateOrgProfileForm
                initialProfile={userProfile as OrgProfile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
