"use client";
import {
  Home,
  Inbox,
  Users,
  Heart,
  Award,
  DollarSign,
  Download,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

// Menu items with updated symbols
const items = [
  {
    title: "Home",
    url: "/pasaydan/admin",
    icon: Home,
  },
  {
    title: "Manage Drives",
    url: "/pasaydan/admin/drives",
    icon: Inbox,
  },
  {
    title: "Users Information",
    url: "/pasaydan/admin/users",
    icon: Users,
  },
  {
    title: "Donation Requests",
    url: "/pasaydan/admin/donationRequests",
    icon: Heart,
  },
  {
    title: "Certificates",
    url: "/pasaydan/admin/certificates",
    icon: Award,
  },
  {
    title: "Transactions",
    url: "/pasaydan/admin/transactions",
    icon: DollarSign,
  },
  {
    title: "Data Download",
    url: "/pasaydan/admin/downloadData",
    icon: Download,
  },
  {
    title: "Settings",
    url: "/pasaydan/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();

  return (
    <Sidebar className="w-64 border-none bg-[#40434e] text-white shadow-lg">
      <SidebarContent className="bg-[#40434e]">
        <SidebarGroup className="bg-[#40434e]">
          <SidebarGroupLabel className="text-md text-white tracking-tighter mb-4 mt-12 pl-4">
            Admin Window
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = router.pathname === item.url;

                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={`group h-8 ${
                      isActive ? "bg-[#565869] text-white" : ""
                    }`}
                  >
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        aria-label={item.title}
                        className={`flex items-center space-x-3 p-3 rounded-md transition-all ${
                          isActive
                            ? "font-semibold"
                            : "hover:bg-[#565869] hover:shadow-md"
                        }`}
                      >
                        <item.icon className="text-xl" />
                        <span className="text-sm font-medium tracking-tight">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
