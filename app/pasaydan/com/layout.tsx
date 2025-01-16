import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google"; // Import Roboto
import "../../globals.css";
import Layout from "@/app/components/layout";
import jwt from "jsonwebtoken";
import { Lato, Poppins } from "next/font/google";

const lato = Lato({
  subsets: ["latin"], // Specify subsets
  weight: ["400", "700"], // Define font weights
  variable: "--font-lato", // Define a CSS variable
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const geistSans = Geist({
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Pasaydan",
  description: "Developed for Pasaydan NGO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${poppins.variable} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
