"use client";

import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";
import Image from "next/image";
import heroo from "@/assets/homepage/heroo.png";

const Mission: React.FC = () => {
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full bg-gradient-to-b md:from-white md:to-blue-50">
      <div className="w-[92%] md:w-4/5 mx-auto py-8 md:py-16">
        <div className="relative container mx-auto px-2 sm:px-4">
          <motion.h2
            className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Vision and Mission
          </motion.h2>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
            {/* Left Column - Cards */}
            <motion.div
              className="w-full lg:w-1/2 space-y-8"
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
            >
              {/* Vision Card */}
              <motion.div variants={itemAnimation}>
                <Card className="w-full transform md:hover:scale-105 transition-transform duration-300 shadow-md bg-white backdrop-blur glow-effect border border-gray-200">
                  <CardHeader className="relative pb-0">
                    <div className="absolute -top-4 sm:-top-6 md:-top-8 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-900 p-2 sm:p-3 md:p-4 rounded-full shadow-lg glow-icon">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-blue-900 text-center pt-4 sm:pt-6 md:pt-8">
                      Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 sm:pt-4 md:pt-6 pb-4 sm:pb-6 md:pb-8 px-2 sm:px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4">
                      <FaQuoteLeft className="text-xl sm:text-2xl md:text-3xl text-blue-900" />
                      <CardDescription className="text-center text-xs sm:text-sm md:text-base lg:text-lg text-slate-700 font-medium leading-relaxed">
                        To prescribe - by preach or by practice - the remedy to
                        human suffering, whether spiritual, moral, physical, or
                        material.
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Mission Card */}
              <motion.div variants={itemAnimation}>
                <Card className="w-full transform hover:scale-105 transition-transform duration-300 shadow-md bg-white backdrop-blur glow-effect border border-gray-200">
                  <CardHeader className="relative pb-0">
                    <div className="absolute -top-4 sm:-top-6 md:-top-8 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-900 p-2 sm:p-3 md:p-4 rounded-full shadow-lg glow-icon">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-blue-900 text-center pt-4 sm:pt-6 md:pt-8">
                      Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 sm:pt-4 md:pt-6 pb-4 sm:pb-6 md:pb-8 px-2 sm:px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4">
                      <FaQuoteLeft className="text-xl sm:text-2xl md:text-3xl text-blue-900" />
                      <CardDescription className="text-center text-xs sm:text-sm md:text-base lg:text-lg text-slate-700 font-medium leading-relaxed">
                        To adopt ways and means for the spiritual, moral &
                        material progress of society based on Indian culture and
                        traditions...
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Right Column - Overlapping Images */}
            <motion.div
              className="w-full lg:w-1/2 relative h-[600px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Background blue box */}
              <div className="absolute right-0 top-8 w-4/5 h-[500px] bg-blue-900 rounded-3xl transform rotate-6"></div>

              {/* Hero image */}
              <motion.div
                className="absolute right-8 top-0 w-4/5 h-[500px] overflow-hidden rounded-3xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={heroo}
                  alt="Hero illustration"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-3xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        .glow-effect {
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          transition: all 0.3s ease;
        }

        .glow-effect:hover {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .glow-icon {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }

        .glow-effect:hover .glow-icon {
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
        }

        @media (max-width: 640px) {
          .glow-effect {
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Mission;
