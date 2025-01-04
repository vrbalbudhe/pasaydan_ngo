"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Edit, User } from "lucide-react";
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
};

const formatDate = (date: string | null): string => {
  if (!date) return "Not available";
  return new Date(date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getInitials = (fullname: string | null): string => {
  if (!fullname) return "U";
  return fullname
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const fetchUserProfileData = async (
  email: string | null
): Promise<UserProfile | null> => {
  if (!email) return null;
  try {
    const res = await fetch(`/api/user/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data?.user || null;
  } catch (error) {
    console.error("Failed to fetch user profile data:", error);
    return null;
  }
};

export default function Profile() {
  const [editForm, setEditForm] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();
        if (res.ok && data?.user) {
          const userProfileData = await fetchUserProfileData(data.user.email);
          setUserProfile({ ...data.user, ...userProfileData });
        } else {
          router.push("/pasaydan/auth/logsign");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/pasaydan/auth/logsign");
      }
    };

    fetchUserProfile();
  }, []);

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const toggleForm = () => setEditForm((prev) => !prev);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        alert("Successfully logged out");
        router.push("/pasaydan/com");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/pasaydan/com");
    }
  };

  return (
    <div className="md:w-[88%] container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 border border-slate-100 bg-slate-200">
              {userProfile.avatar ? (
                <AvatarImage
                  src={userProfile.avatar}
                  alt={userProfile.fullname || "User"}
                />
              ) : (
                <AvatarFallback className="bg-primary/10">
                  {getInitials(userProfile.fullname)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {userProfile.fullname || "Anonymous User"}
              </h1>
              <p className="text-blue-500 ml-1 -tracking-tight">
                {userProfile.email}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(userProfile?.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={toggleForm} className="gap-2 bg-[#2d232e]">
              <Edit className="h-4 w-4" />
              {!editForm ? "Edit Profile" : "Close"}
            </Button>
            <Button
              onClick={() => handleLogout()}
              className="gap-2 bg-[#2d232e]"
            >
              <MdLogout className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="space-y-3">
          {/* Account Details */}
          <Card className="rounded-md border-none bg-[#2d232e]">
            <CardHeader>
              <CardTitle className="text-white">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-200">Member ID:</span>
                <span className="font-semibold text-blue-500 ml-2">
                  {userProfile.id}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-200">Joined:</span>
                <span className="text-blue-500 ml-2">
                  {formatDate(userProfile.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="rounded-md bg-[#2d232e] border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-200" />
                <span className="text-white text-sm">{userProfile.email}</span>
              </div>
              {userProfile.mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-200" />
                  <span className="text-white text-sm">
                    {userProfile.mobile}
                  </span>
                </div>
              )}
              {userProfile.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-200" />
                  <span className="text-white text-sm">
                    {userProfile.address}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* About / Activity / Edit Profile */}
        <div className="lg:col-span-2">
          {!editForm ? (
            <Tabs
              defaultValue="about"
              className="w-full bg-slate-200 p-2 rounded-md"
            >
              <TabsList className="grid w-full grid-cols-2 bg-[#2d232e] rounded-sm">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card className="rounded-sm bg-[#2d232e]">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2 text-white">About Me</h3>
                    <p className="text-gray-400 text-sm">
                      {userProfile.fullname
                        ? `${userProfile.fullname} is a valued member of our NGO community.`
                        : "Welcome to our NGO community!"}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="rounded-sm bg-[#2d232e]">
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-400">
                      Activity tracking will be implemented in future updates.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="w-full flex justify-center">
              <UpdateProfileForm initialProfile={userProfile} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
