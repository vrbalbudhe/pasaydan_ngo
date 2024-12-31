import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Edit, User } from "lucide-react";

// Type definition based on Prisma schema
type UserProfile = {
  id: string;
  fullname: string | null;
  email: string;
  address: string | null;
  avatar: string | null;
  mobile: string | null;
  createdAt: Date;
};

export default async function Profile() {
  const headersList = await headers();
  const userHeader = headersList.get("x-user");
  // console.log(userHeader);
  const userProfile: UserProfile = {
    id: "1",
    fullname: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    address: "123 Volunteer Street, Charity City",
    avatar: null,
    mobile: "+1 (555) 123-4567",
    createdAt: new Date("2023-01-15"),
  };

  // Function to get initials for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format date to readable string
  const formatDate = (date: Date) => {
    return `Member since ${date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}`;
  };

  return (
    <div className="w-[90%] container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
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
              <h1 className="text-2xl font-bold">
                {userProfile.fullname || "Anonymous User"}
              </h1>
              <p className="text-gray-500">{userProfile.email}</p>
              <p className="text-sm text-gray-400">
                {formatDate(userProfile.createdAt)}
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Info Cards */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{userProfile.email}</span>
              </div>
              {userProfile.mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{userProfile.mobile}</span>
                </div>
              )}
              {userProfile.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{userProfile.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-500">Member ID: </span>
                <span className="font-mono">{userProfile.id}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Joined: </span>
                <span>{userProfile.createdAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About Me</h3>
                      <p className="text-gray-600">
                        {userProfile.fullname
                          ? `${userProfile.fullname} is a valued member of our NGO community.`
                          : "Welcome to our NGO community!"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">
                        Contact Preferences
                      </h3>
                      <p className="text-gray-600">
                        You can reach out through email
                        {userProfile.mobile ? " or phone" : ""}.
                        {!userProfile.mobile &&
                          " Consider adding a phone number for better communication."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-gray-500">
                    <p>
                      Activity tracking will be implemented in future updates.
                    </p>
                    <p className="text-sm mt-2">
                      This section will show your participation in various NGO
                      activities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
