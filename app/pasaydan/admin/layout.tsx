import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "../../globals.css";
import AdminLayout from "@/components/adminLayout";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Admin/sideBar";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Pasaydan Admin",
  description: "Developed By Varun, Shivam",
};

export default function RootAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}  antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger className="w-10 absolute top-0 p-5 text-[#323031]" />
          <AdminLayout>{children}</AdminLayout>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
