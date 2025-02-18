import CommunityHeroSection from "@/components/community/CommunityHeroSection";
import CommunityPeople from "@/components/community/CommunityPeople";

const CommunityPageHeading = () => {
  return (
    <div className="w-[90%] pl-2 min-h-[250px] flex flex-col justify-center items-center">
      <h1 className="text-center md:text-6xl font-medium text-5xl text-slate-800">
        Witness Our
        <span className="ml-2 font-bold text-[#0496ff]">Community</span>
      </h1>
      <p className="md:w-[80%] w-[100%] text-center text-md p-5 tracking-tight text-gray-700">
        Join us in transforming lives and building a stronger community. Through
        your support and our dedicated efforts, we bring hope, resources, and
        opportunities to those in need. Together, we can create a brighter
        future for everyone. Witness the power of unity with OurCommunity!
      </p>
    </div>
  );
};

export default function Community() {
  return (
    <div className="w-[95%] min-h-screen relative mb-10 flex flex-col justify-start items-center">
      <CommunityHeroSection />
      <CommunityPageHeading />
      <div className="w-[90%] h-fit flex justify-center items-center gap-2 md:gap-2 flex-wrap">
        <CommunityPeople />
      </div>
    </div>
  );
}
