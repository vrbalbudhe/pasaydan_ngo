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
    <div className="relative  py-8 md:py-16">
      <div className="relative container mx-auto px-2 sm:px-4">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Vision and Mission
        </motion.h2>

        <motion.div
          className="max-w-7xl mx-auto space-y-8 md:space-y-16"
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
        >
          {/* Vision Section */}
          <motion.div
            className="flex flex-row items-center gap-4 md:gap-8 lg:gap-16"
            variants={itemAnimation}
          >
            <div className="w-1/2">
              <Card className="w-full transform hover:scale-105 transition-transform duration-300 shadow-xl bg-white/90 backdrop-blur glow-effect border-2 border-blue-200">
                <CardHeader className="relative pb-0">
                  <div className="absolute -top-4 sm:-top-6 md:-top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-900 p-2 sm:p-3 md:p-4 rounded-full shadow-lg glow-icon">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-900 text-center pt-4 sm:pt-6 md:pt-8">
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
            </div>
            <motion.img
              src="/api/placeholder/600/400"
              alt="Vision illustration"
              className="w-1/2 h-auto object-cover rounded-xl sm:rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Mission Section */}
          <motion.div
            className="flex flex-row-reverse items-center gap-4 md:gap-8 lg:gap-16"
            variants={itemAnimation}
          >
            <div className="w-1/2">
              <Card className="w-full transform hover:scale-105 transition-transform duration-300 shadow-xl bg-white/90 backdrop-blur glow-effect border-2 border-blue-200">
                <CardHeader className="relative pb-0">
                  <div className="absolute -top-4 sm:-top-6 md:-top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-900 p-2 sm:p-3 md:p-4 rounded-full shadow-lg glow-icon">
                      <Target className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-900 text-center pt-4 sm:pt-6 md:pt-8">
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
            </div>
            <motion.img
              src="/api/placeholder/600/400"
              alt="Mission illustration"
              className="w-1/2 h-auto object-cover rounded-xl sm:rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
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
