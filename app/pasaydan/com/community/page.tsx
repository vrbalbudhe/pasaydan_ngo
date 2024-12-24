"use client";
import Image from "next/image";
import com from "@/assets/Community/11.jpg";
import ProfileCard from "@/components/community/profileCard";

export default function Community() {
  return (
    <div className="w-[95%] min-h-screen relative mb-10 flex flex-col justify-start items-center">
      <div className="w-[95%] h-screen relative">
        <Image
          className="object-contain"
          src={com}
          alt="Community event"
          layout="fill"
        />
        {/* Text appearing on top */}
        <p className="absolute top-40 tracking-tighter flex-wrap left-10 text-slate-800 text-7xl opacity-0 animate-fadeIn z-10">
          Join
          <span className="block text-blue-500 font-bold">Pasaydan</span>
          <span className="block">Community</span>
        </p>
        <p className="absolute top-[375px] font-semibold left-10 text-slate-800 text-md ml-2 opacity-0 animate-fadeIn z-10">
          जो जे वांच्छिल तो तें लाहो । प्राणिज
        </p>
        <p className="absolute top-[210px] right-40 text-4xl text-slate-800 opacity-0 animate-fadeIn z-10">
          Together
          <span className="block text-4xl">We</span>
          <span className="block text-4xl">Make</span>
          <span className="block mt-2 text-[80px] font-bold text-blue-500">
            Better
          </span>
          <span className="block mt-2 text-4xl">Future</span>
        </p>
      </div>
      <div className="w-[90%] pl-2 h-28 flex justify-center items-center">
        <h1 className="text-center text-5xl text-slate-800">
          Witness Our
          <span className="ml-2 font-bold text-slate-700">Community</span>
        </h1>
      </div>
      <div className="w-[90%] h-fit flex justify-center items-center gap-2 flex-wrap">
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
