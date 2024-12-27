"use client";
import { Button } from "@/components/ui/button";
import { GetServerSideProps } from "next";
import { prisma } from "@/prisma/client";
import jwt from "jsonwebtoken";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Define TypeScript types for the props
interface UserData {
  email: string;
  // fullname?: string;
  // avatar?: string;
}

interface NavbarProps {
  userData: UserData;
}

const Navbar = ({ userData }: NavbarProps) => {
  const pathname = usePathname();
  const isActiveRoute = (route: string) => pathname === route;
  return (
    <div className="w-[95%] md:w-[92%] h-[70px] flex justify-between items-center p-5">
      {/* Logo */}
      <Link href="/pasaydan/com">
        <p className="-tracking-tighter text-xl text-slate-800">Pasaydan</p>
      </Link>
      {/* Navigation Links */}
      <div className="hidden md:block">
        <ul className="flex gap-3 text-sm -tracking-tighter">
          {/* <Link href="/pasaydan/com">
            <li className="hover:text-slate-700 cursor-pointer">Home</li>
          </Link> */}
          <Link href="/pasaydan/com/donate">
            <li
              className={`cursor-pointer ${
                isActiveRoute("/pasaydan/com/donate")
                  ? "text-blue-700"
                  : "text-gray-700"
              } hover:text-slate-700`}
            >
              Donate
            </li>
          </Link>
          <Link href="/pasaydan/com/drive">
            <li
              className={`cursor-pointer ${
                isActiveRoute("/pasaydan/com/drive")
                  ? "text-blue-700"
                  : "text-gray-700"
              } hover:text-slate-700`}
            >
              Drive
            </li>
          </Link>
          <li
            className={`cursor-pointer ${
              isActiveRoute("/pasaydan/com/contributions")
                ? "text-blue-700"
                : "text-gray-700"
            } hover:text-slate-700`}
          >
            Contributions
          </li>
          <Link href="/pasaydan/com/community">
            <li
              className={`cursor-pointer ${
                isActiveRoute("/pasaydan/com/community")
                  ? "text-blue-700"
                  : "text-gray-700"
              } hover:text-slate-700`}
            >
              Community
            </li>
          </Link>
          <Link href="/pasaydan/com/about">
            <li
              className={`cursor-pointer ${
                isActiveRoute("/pasaydan/com/about")
                  ? "text-blue-700"
                  : "text-gray-700"
              } hover:text-slate-700`}
            >
              About
            </li>
          </Link>
        </ul>
      </div>
      {/* Avatar and Profile Button */}
      <div className="flex justify-center items-center gap-5">
        <Avatar>
          {/* <AvatarImage src={"https://github.com/shadcn.png"} /> */}
          <AvatarFallback className="border-2 bg-slate-100">
            {userData?.email ? userData.email[0] : "U"}
          </AvatarFallback>
        </Avatar>
        <Link href="/pasaydan/com/profile">
          <Button
            variant="outline"
            className="-tracking-tighter bg-[#4361ee] rounded-[10px] border-none text-white shadow-sm shadow-slate-100"
          >
            Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
