
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

const items = [
  {
    title: "Dashboard",
    url: "/pasaydan/admin",
    icon: Home,
  },
  {
    title: "Manage Drives",
    url: "/pasaydan/admin/drives",
    icon: Inbox,
  },
  {
    title: "Users",
    url: "/pasaydan/admin/users",
    icon: Users,
  },
  {
    title: "Donations",
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
    icon: IndianRupeeIcon,
  },
  {
    title: "Downloads",
    url: "/pasaydan/admin/downloadData",
    icon: Download,
  },
  {
    title: "EnterData",
    url: "/pasaydan/admin/enterData",
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
    <Sidebar className="w-60 lg:w-64 border-none bg-[#40434e] text-white min-h-screen">
      <SidebarContent className="bg-[#40434e]">
        <div className="px-4 py-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white">Pasaydan</h1>
          </div>

          <SidebarGroup className="bg-[#40434e]">
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-white font-medium px-3 mb-3">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = window.location.pathname === item.url;

                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`mb-1 ${isActive ? "bg-[#565869]" : ""
                        }`}
                    >
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          aria-label={item.title}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                            ? "bg-[#565869] text-white font-semibold"
                            : "text-white hover:bg-[#565869]/50"
                            }`}
                        >
                          <item.icon
                            className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-300"
                              }`}
                          />
                          <span className="text-sm">
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



{/*"use client";
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
} */}
