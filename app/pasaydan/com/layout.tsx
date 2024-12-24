import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Layout from "@/components/layout";
import jwt from "jsonwebtoken";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pasaydan",
  description: "Developed By Varun, Shivam",
};

export default function RootLayout({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: { email: string };
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout userData={userData}>{children}</Layout>{" "}
      </body>
    </html>
  );
}
