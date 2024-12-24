import Image from "next/image";
import heroImage from "../../assets/homepage/hero.jpg";

export function HeroSection() {
  return (
    <div className="w-full h-[600px] relative mb-10 ">
      <Image
        src={heroImage}
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        className="z-0 shadow-sm "
      />
    </div>
  );
}
