import { ReactNode } from "react";
import Navbar from "../app/components/navbar";
import Footer from "./footer";

interface LayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col">
      <div className="w-[100%] min-h-screen flex flex-col justify-center items-start">
        <div className="bg-[#171e3e] w-full h-full flex justify-center items-start">
          <Navbar />
        </div>
        <main className="w-full min-h-screen flex justify-center items-start">
          {children}
        </main>
        <div className="bg-[#171e3e] w-full h-full flex justify-center items-start p-5">
          <Footer />
        </div>{" "}
      </div>
    </div>
  );
}
