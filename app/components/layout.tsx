import { ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "../../components/footer";
interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col">
      <Navbar />
      <div className="w-[100%] min-h-screen flex justify-center items-start">
        <main className="w-full min-h-screen pt-5 flex justify-center items-start">
          {children}
        </main>
      </div>
      <div className="bg-[#2d232e] w-full h-full flex justify-center items-start p-5">
        <Footer />
      </div>
    </div>
  );
}