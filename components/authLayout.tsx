import { ReactNode } from "react";
import Navbar from "../app/components/navbar";
import Footer from "./footer";

interface LayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="w-full h-fit md:min-h-screen flex justify-start items-center flex-col">
      <div className="w-[100%] md:min-h-screen flex flex-col justify-center items-start">
        <div className=" w-full h-full flex justify-center items-start">
          <Navbar />
        </div>
        <main className="w-full h-fit md:min-h-screen bg-gradient-to-r from-[#89f7fe] to-[#66a6ff] flex justify-center items-start">
          {children}
        </main>
        <div className="bg-black w-full h-full flex justify-center items-start p-5">
          <Footer />
        </div>{" "}
      </div>
    </div>
  );
}
