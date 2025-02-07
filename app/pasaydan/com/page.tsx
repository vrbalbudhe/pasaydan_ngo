import HeroSection from "@/components/homepage/hero";
import TitleInfo from "@/components/homepage/titleInfo";
import Vision from "@/components/homepage/vison";
import Metrics from "@/components/homepage/metric";
import Mission from "@/components/homepage/mission";
import ContactUs from "@/components/homepage/contact";
import QRSection from "@/components/homepage/QRSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <HeroSection />
      <TitleInfo />
      <div className="md:bg-gradient-to-b md:from-white md:via-[#f8faff] md:to-[#edf2ff] w-full flex flex-col justify-center items-center">
        <Vision />
        <QRSection />
        <Metrics />
        <Mission />
      </div>
      <ContactUs />
    </div>
  );
}
