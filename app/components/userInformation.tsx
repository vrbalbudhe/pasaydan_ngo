"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

type UserProfile = {
  role: string;
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/pasaydan/auth/logsign");
        router.refresh();
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/pasaydan/auth/logsign">
          <Button
            variant="outline"
            className="-tracking-tighter bg-gray-800 hover:bg-blue-500 hover:text-white rounded-none border-none text-white shadow-sm shadow-slate-100"
          >
            Donate Us
          </Button>
        </Link>
      </div>
    );
  }
  // console.log(user);

  return (
    <div
      className="flex items-center space-x-2 gap-2 relative"
      ref={dropdownRef}
    >
      <div
        className="cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Avatar>
          <AvatarFallback className="border-2 bg-slate-100">
            {user.email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-12 right-0 w-48 bg-white shadow-lg rounded-md py-2 z-50">
          {user?.userType && (
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              Signed in as <span className="font-medium">{user.email}</span>
            </div>
          )}

          {(user?.userType === "individual" ||
            user?.userType === "organization") && (
            <Link href="/pasaydan/com/profile">
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                Profile
              </div>
            </Link>
          )}

          {(user?.userType === "Admin" || user?.userType === "MiniAdmin") && (
            <Link href="/pasaydan/admin">
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                Admin Dashboard
              </div>
            </Link>
          )}

          <div
            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      )}

      {/* Keep the buttons outside the dropdown for visibility */}
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

      {(user?.role === "Admin" || user?.role === "MiniAdmin") && (
        <Link href="/pasaydan/admin">
          <Button
            variant="outline"
            className="-tracking-tighter bg-gray-800 hover:bg-gray-800 hover:text-blue-600 rounded-[10px] border-none text-white shadow-sm shadow-slate-100"
          >
            Admin
          </Button>
        </Link>
      )}
    </div>
  );
}
