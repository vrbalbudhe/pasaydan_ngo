"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import childJson from "@/assets/homepage/child.json";
import cycleJson from "@/assets/homepage/cycle.json";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function TitleInfo() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: childJson,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const lottie = {
    loop: true,
    autoplay: true,
    animationData: cycleJson,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="relative min-h-screen w-[95%] md:w-4/5 mx-auto md:py-20">
      {/* Background Decorations */}

      <div className="relative container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          className="text-center space-y-4 mb-16"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <motion.h1
            className="text-7xl sm:text-6xl md:text-7xl lg:text-[70px] md:font-bold font-medium text-[#0047AB] tracking-tight"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            पसायदान
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-3xl text-gray-600 font-semibold"
            variants={fadeInUp}
          >
            जो जे वांच्छिल तो तें लाहो । प्राणिज
          </motion.h2>

          <motion.p
            className="text-xl md:text-lg italic text-slate-700"
            variants={fadeInUp}
          >
            ~ संत ज्ञानेश्वर महाराज
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto relative">
          {/* Lottie Animations */}
          <motion.div
            className="absolute -top-16 left-4 w-20 h-20 sm:w-24 sm:h-24 z-10"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Lottie {...lottie} />
          </motion.div>

          <motion.div
            className="absolute -top-16 right-4 w-20 h-20 sm:w-24 sm:h-24 z-10"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Lottie {...lottieOptions} />
          </motion.div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="backdrop-blur-sm md:bg-white shadow-none md:border border-none md:border-gray-200 rounded-2xl md:shadow-xl">
              <CardHeader className="space-y-8">
                {/* Marathi Description */}
                <CardDescription className="text-xl md:text-2xl text-gray-800 leading-relaxed text-center font-semibold">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="md:p-4 p-2 rounded-xl md:bg-blue-50/50"
                  >
                    पसायदान हा शब्द पासा (पसा) या दोन शब्दांची रचना आहे ज्याचा
                    अर्थ हाताचे तळवे एकमेकांना जोडलेले आहेत (जसे आपण कोणीतरी
                    आपल्या हातात भरपूर चॉकलेट देणार असेल तेव्हा बनवतो) आणि दान
                    (दान) म्हणजे भेट. एकत्रितपणे त्यांचा अर्थ एक भेटवस्तू आहे जी
                    हस्तरेखांमध्ये एकत्र जोडली जाऊ शकते किंवा घेतली जाऊ शकते.
                  </motion.div>
                </CardDescription>

                {/* English Description */}
                <CardDescription className="text-xl md:text-lg text-gray-800 italic text-center font-semibold">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="p-4 rounded-xl md:bg-purple-50/50"
                  >
                    THE WORD PASAYDAN IS A COMPOSITION OF TWO WORDS PASA (HT)
                    WHICH MEANS PALMS SPREAD JOINED TOGETHER (LIKE WE MAKE WHEN
                    SOMEONE IS ABOUT TO GIVE A LOT OF CHOCOLATES IN OUR HANDS)
                    AND DAN () WHICH MEANS GIFT. TOGETHER THEY MEAN A GIFT WHICH
                    CAN BE TAKEN
                  </motion.div>
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
