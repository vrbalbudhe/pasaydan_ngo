import { ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "../../components/footer";
interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full min-h-screen flex justify-start font-lexend items-center flex-col">
      <Navbar />
      <div className="w-[100%] min-h-screen flex justify-center items-start">
        <main className="w-full min-h-screen flex justify-center items-start">
          {children}
        </main>
      </div>
      <div className="bg-gray-800 w-full h-full flex justify-center items-start p-5">
        <Footer />
      </div>
    </div>
  );
}
