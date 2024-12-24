import { HeroSection } from "@/components/homepage/hero";
import TitleInfo from "@/components/homepage/titleInfo";
import Vision from "@/components/homepage/vison";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full mb-10 flex flex-col justify-start items-center">
      <HeroSection />
      <TitleInfo />
      <Vision />
    </div>
  );
}
