"use client";
import React from "react";
import Image from "next/image";
import com from "@/assets/Community/11.jpg";

function CommunityHeroSection() {
  return (
    <div className="w-[95%] h-screen flex justify-center items-start relative">
      <Image
        className="object-contain"
        src={com}
        alt="Community event"
        layout="fill"
      />
      {/* Text appearing on top */}
      <p className="hidden md:block absolute top-40 tracking-tighter flex-wrap left-10 text-slate-800 text-7xl opacity-0 animate-fadeIn z-10">
        Join
        <span className="block text-blue-500 font-bold">Pasaydan</span>
        <span className="block">Community</span>
      </p>
      <p className="hidden md:block absolute top-[375px] font-semibold left-10 text-slate-800 text-md ml-2 opacity-0 animate-fadeIn z-10">
        जो जे वांच्छिल तो तें लाहो । प्राणिज
      </p>
      <p className="hidden md:block absolute top-[210px] right-40 text-4xl text-slate-800 opacity-0 animate-fadeIn z-10">
        Together
        <span className="block text-4xl">We</span>
        <span className="block text-4xl">Make</span>
        <span className="block mt-2 text-[80px] font-bold text-blue-500">
          Better
        </span>
        <span className="block mt-2 text-4xl">Future</span>
      </p>
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

export default CommunityHeroSection;
