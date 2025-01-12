"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Edit, User, Loader2 } from "lucide-react";
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

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-[90%] mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-28 w-28 ring-2 ring-gray-100">
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
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-2xl">
                    {isUserProfile(userProfile)
                      ? getInitials(userProfile.fullname)
                      : getInitials(userProfile.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isUserProfile(userProfile)
                    ? userProfile.fullname
                    : userProfile.name || "Anonymous User"}
                </h1>
                <p className="text-gray-600">{userProfile?.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {formatDate(userProfile?.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex gap-3 self-start md:self-center">
              {!isUserProfile(userProfile) && userProfile?.orgId && (
                <Button variant="outline" className="border-gray-200">
                  Organization ID: {userProfile?.orgId}
                </Button>
              )}
              <Button
                onClick={() => setEditForm(!editForm)}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                {!editForm ? "Edit Profile" : "Close"}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                <MdLogout className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-gray-900">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Member ID</span>
                  <span className="font-medium text-gray-900">
                    {userProfile?.id}
                  </span>
                </div>
                {userProfile?.orgId && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Organisation ID</span>
                    <span className="font-medium text-gray-900">
                      {userProfile?.orgId}
                    </span>
                  </div>
                )}{" "}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Join Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(userProfile?.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-100">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{userProfile.email}</span>
                </div>
                {userProfile.mobile && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{userProfile.mobile}</span>
                  </div>
                )}
                {userProfile.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{userProfile.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {!editForm ? (
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-6">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                  >
                    Activity
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="about">
                  <Card className="shadow-sm border-gray-100">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-4">
                        About Me
                      </h3>
                      <p className="text-gray-600">
                        {isUserProfile(userProfile)
                          ? `${userProfile.fullname} is a valued member of our NGO community.`
                          : "Welcome to our NGO community!"}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="activity">
                  <Card className="shadow-sm border-gray-100">
                    <CardContent className="pt-6">
                      <p className="text-gray-600">
                        No recent activity to display.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <UpdateProfileForm
                initialProfile={
                  (userProfile as UserProfile) || (userProfile as OrgProfile)
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
