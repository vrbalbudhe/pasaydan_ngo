import HeroSection from "@/components/homepage/hero";
import TitleInfo from "@/components/homepage/titleInfo";
import Vision from "@/components/homepage/vison";
import Metrics from "@/components/homepage/metric";
import Mission from "@/components/homepage/mission";
import ContactUs from "@/components/homepage/contact";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full pb-10 flex flex-col justify-start items-center">
      <HeroSection />
      <TitleInfo />
      <div className="bg-gradient-to-b from-white via-[#f8faff] to-[#edf2ff] w-full flex flex-col justify-center items-center">
        <Vision />
        <Metrics />
        <Mission />
      </div>
      <ContactUs />
    </div>
  );
}
