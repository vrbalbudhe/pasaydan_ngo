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
  Link,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import UpdateProfileForm from "@/components/user/EditProfileInfo";

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
};

type OrgProfile = {
  id: string | null;
  orgId: string | null;
  name: string | null;
  email: string | null;
  contactPerson: string | null;
  address: string | null;
  addressId: string | null;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Card */}
        <Card className="border-none shadow-none mb-2">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
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
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl">
                    {isUserProfile(userProfile)
                      ? getInitials(userProfile.fullname)
                      : getInitials(userProfile.name)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="space-y-2">
                  <h1 className="text-2xl ml-2 font-bold text-gray-700">
                    {isUserProfile(userProfile)
                      ? userProfile.fullname
                      : userProfile.name || "Anonymous User"}
                  </h1>
                  <p className="text-md ml-2 text-gray-600">
                    {userProfile.email}
                  </p>
                  <div className="flex flex-col flex-wrap gap-2 justify-center md:justify-start">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 -tracking-tight w-fit text-sm text-slate-500"
                    >
                      Member since {formatDate(userProfile.createdAt)}
                    </Badge>
                    {userProfile.orgId && (
                      <Badge
                        variant="secondary"
                        className="bg-green-50 -tracking-tight text-sm w-fit text-green-700"
                      >
                        {userProfile.orgId}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setEditForm(!editForm)}
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {!editForm ? "Edit Profile" : "Close"}
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MdLogout className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left Sidebar */}
          <div className="w-full flex flex-col gap-2">
            <Card className="shadow-none border-2">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Member ID</span>
                  <span className="font-medium text-gray-900">
                    {userProfile.id}
                  </span>
                </div>
                {userProfile.orgId && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Organisation ID</span>
                    <span className="font-medium text-gray-900">
                      {userProfile.orgId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Join Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(userProfile.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-2">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-600">{userProfile.email}</span>
                </div>
                {userProfile.mobile && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600">{userProfile.mobile}</span>
                  </div>
                )}
                {userProfile.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600">{userProfile.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {!editForm ? (
              <Card className="shadow-none bg-slate-200 border-none">
                <CardContent className="p-6">
                  <Tabs defaultValue="about" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 mb-6">
                      <TabsTrigger
                        value="about"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        About
                      </TabsTrigger>
                      <TabsTrigger
                        value="activity"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        Activity
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="about">
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          About Me
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {isUserProfile(userProfile)
                            ? `${userProfile.fullname} is a valued member of our NGO community.`
                            : "Welcome to our NGO community!"}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="activity">
                      <p className="text-gray-600">
                        No recent activity to display.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <UpdateProfileForm initialProfile={userProfile as UserProfile} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
