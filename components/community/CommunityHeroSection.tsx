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
      {/* Text appearing on top - Left side */}
      <div className="absolute top-20 md:top-40 left-4 md:left-10 z-10">
        <p className="tracking-tighter text-5xl md:text-7xl text-slate-800 opacity-0 animate-fadeIn font-medium">
          Join
          <span className="block text-[#0496ff] font-bold">Pasaydan</span>
          <span className="block">Community</span>
        </p>
        <p className="font-semibold text-lg md:text-md text-slate-800 mt-4 md:mt-8 ml-2 opacity-0 animate-fadeIn">
          जो जे वांच्छिल तो तें लाहो । प्राणिज
        </p>
      </div>

      {/* Text appearing on top - Right side */}
      <div className="absolute top-[70%] md:top-[210px] right-4 md:right-40 text-right md:text-left z-10">
        <p className="text-3xl md:text-4xl text-slate-800 opacity-0 animate-fadeIn font-medium">
          Together
          <span className="block">We</span>
          <span className="block">Make</span>
          <span className="block mt-2 text-5xl md:text-[80px] font-bold text-[#0496ff]">
            Better
          </span>
          <span className="block mt-2">Future</span>
        </p>
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

export default CommunityHeroSection;
