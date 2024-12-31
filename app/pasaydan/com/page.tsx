import HeroSection  from "@/components/homepage/hero";
import TitleInfo from "@/components/homepage/titleInfo";
import Vision from "@/components/homepage/vison";
import Metrics from "@/components/homepage/metric";
import Mission from "@/components/homepage/mission";
import ContactUs from "@/components/homepage/contact";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full mb-10 flex flex-col justify-start items-center">
      <HeroSection />
      <TitleInfo />
      <Vision />
      <Metrics/>
      <Mission/>
      <ContactUs/>
    </div>
  );
}
