import { ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

interface LayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col">
      <div className="w-[100%] min-h-screen flex justify-center items-start">
        <main className="w-full min-h-screen pt-5 flex justify-center items-start">
          {children}
        </main>
      </div>
    </div>
  );
}
