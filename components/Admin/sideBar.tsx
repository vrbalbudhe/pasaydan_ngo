"use client";

import {
  Home,
  Inbox,
  Users,
  Heart,
  Award,
  IndianRupeeIcon,
  Download,
  Settings,
  FileText,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { MdLogout } from "react-icons/md";

const items = [
  { title: "Dashboard", url: "/pasaydan/admin", icon: Home },
  { title: "Manage Drives", url: "/pasaydan/admin/drives", icon: Inbox },
  { title: "Users", url: "/pasaydan/admin/users", icon: Users },
  { title: "Donations", url: "/pasaydan/admin/donationRequests", icon: Heart },
  { title: "Certificates", url: "/pasaydan/admin/certificates", icon: Award },
  { title: "Transactions", url: "/pasaydan/admin/transactions", icon: IndianRupeeIcon },
  { title: "Downloads", url: "/pasaydan/admin/downloadData", icon: Download },
  { title: "EnterData", url: "/pasaydan/admin/enterData", icon: FileText },
  { title: "Manage Admins", url: "/pasaydan/admin/logsign", icon: Shield },
  { title: "Settings", url: "/pasaydan/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

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
    <Sidebar className="w-60 lg:w-64 border-none bg-white text-gray-800 md:bg-[#40434e] md:text-white min-h-screen">
      <SidebarContent className="md:bg-[#40434e] bg-white text-gray-800 md:text-white">
        <div className="px-4 py-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-lg font-bold md:text-white text-gray-800">P</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight md:text-white text-gray-800">
              Pasaydan
            </h1>
          </div>

          <SidebarGroup className="bg-white text-gray-800 md:bg-[#40434e] md:text-white">
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-800 md:text-white font-medium px-3 mb-3">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  // Use the pathname from the hook instead of window.location.pathname
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`mb-1 ${isActive ? "bg-[#565869]" : ""}`}
                    >
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-[#565869] text-white font-semibold"
                            : "text-white hover:bg-[#565869]/50"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            isActive ? "text-white" : "text-gray-300"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
                <div className="w-full flex justify-center h-full">
                  <Button onClick={handleLogout}>
                    <MdLogout className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="px-4 py-3 mt-auto border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin Portal</p>
              <p className="text-xs text-gray-300">Manage your NGO</p>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
