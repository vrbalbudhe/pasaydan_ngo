import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

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

// Menu items.
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
    icon: Calendar,
  },
  {
    title: "Transactions",
    url: "/pasaydan/admin/users",
    icon: Search,
  },
  {
    title: "Data Download",
    url: "/pasaydan/admin/users",
    icon: Search,
  },
  {
    title: "Donation Requests",
    url: "/pasaydan/admin/users",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-[#2d232e]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">
            Pasaydan Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
