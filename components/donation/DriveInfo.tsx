"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const drives = [
  {
    icon: "🍱",
    title: "Food Donation Drive",
    description: "Help us provide nutritious meals to those in need. We organize regular food distribution drives to combat hunger in our community.",
    impact: "5000+ meals served monthly"
  },
  {
    icon: "🚲",
    title: "Cycle Donation Campaign",
    description: "Donate cycles to help students and workers commute easily. Your contribution can significantly improve someone's daily life.",
    impact: "100+ cycles donated"
  },
  {
    icon: "🧣",
    title: "Winter Relief Drive",
    description: "Provide warmth through blanket donations. Help protect vulnerable communities during harsh winter months.",
    impact: "1000+ blankets distributed"
  },
  {
    icon: "👕",
    title: "Clothing Collection Drive",
    description: "Your gently used clothes can bring dignity and comfort to someone in need. Join our clothing collection initiative.",
    impact: "2000+ families supported"
  }
];

export default function DriveInfo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-4">
          Our Active Drives
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join our ongoing initiatives to make a positive impact in the community
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {drives.map((drive, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <Card className="h-full bg-white/90 backdrop-blur border-2 border-blue-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="text-center p-6">
                <motion.div
                  className="text-4xl mb-4"
                  animate={{
                    scale: hoveredIndex === index ? 1.2 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {drive.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-[#1a237e]">
                  {drive.title}
                </h3>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-gray-600 mb-4 text-center">
                  {drive.description}
                </p>
                <div className="mt-4 pt-4 border-t border-blue-50">
                  <p className="text-sm text-blue-800 font-medium text-center">
                    Impact: {drive.impact}
                  </p>
                </div>
                <motion.div
                  className="mt-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-[#1a237e] hover:bg-[#283593] text-white rounded-full px-6"
                    onClick={() => window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: 'smooth'
                    })}
                  >
                    Donate Now
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Drive Section CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center pb-12"
      >
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 via-white to-blue-50 border-2 border-blue-100 p-8">
          <h3 className="text-2xl font-semibold text-[#1a237e] mb-4">
            Want to Learn More About Our Drives?
          </h3>
          <p className="text-gray-600 mb-6">
            Discover all our ongoing and upcoming donation drives, their impact stories, and how you can get involved.
          </p>
          <Link href="/pasaydan/com/drive">
            <Button 
              className="bg-[#1a237e] hover:bg-[#283593] text-white px-8 py-6 rounded-full group"
              size="lg"
            >
              <span className="mr-2">Visit Drive Section</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}