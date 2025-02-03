"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserProfile = {
  id: string;
  fullname: string | null;
  email: string;
  userType: string;
  address: string | null;
  avatar: string | null;
  mobile: string | null;
  createdAt: string | null;
};

export default function UserInformation() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();
        setUser(data?.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [router]);
  console.log("he he : ", user?.userType);

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/pasaydan/auth/logsign">
          <Button
            variant="outline"
            className="-tracking-tighter bg-blue-600 hover:bg-blue-500 hover:text-white rounded-[10px] border-none text-white shadow-sm shadow-slate-100"
          >
            Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 gap-2">
      <Avatar>
        <AvatarFallback className="border-2 bg-slate-100">
          {user.email?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {(user?.userType === "individual" ||
        user?.userType === "organization") && (
        <Link href="/pasaydan/com/profile">
          <Button
            variant="outline"
            className="-tracking-tighter bg-blue-600 hover:bg-blue-500 hover:text-white rounded-[10px] border-none text-white shadow-sm shadow-slate-100"
          >
            Profile
          </Button>
        </Link>
      )}
      {(user?.userType === "Admin" || user?.userType === "MiniAdmin") && (
        <Link href="/pasaydan/admin">
          <Button
            variant="outline"
            className="-tracking-tighter bg-[#4361ee] hover:bg-[#2d232e] hover:text-white rounded-[10px] border-none text-white shadow-sm shadow-slate-100"
          >
            Admin
          </Button>
        </Link>
      )}
    </div>
  );
}
