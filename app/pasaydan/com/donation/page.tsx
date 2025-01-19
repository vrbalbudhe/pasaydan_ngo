// app/donate/page.tsx
"use client";
import { motion } from "framer-motion";
import DonationForm from "@/components/donation/DonationForm";
import DriveInfo from "@/components/donation/DriveInfo";

export default function DonatePage() {
  return (
    <div className="min-h-screen w-[80%] bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            transform: ["translate(0, 0) scale(1)", "translate(50px, -50px) scale(1.1)", "translate(-20px, 20px) scale(0.9)"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            transform: ["translate(0, 0) scale(1)", "translate(-50px, 50px) scale(1.1)", "translate(20px, -20px) scale(0.9)"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Make a <span className="text-[#1a237e]">Difference</span> Today
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Your contribution can change lives. Join us in our mission to create positive impact through various donation drives.
          </p>
        </motion.div>
      </div>

      {/* Drive Information */}
      <section className="relative py-12">
        <DriveInfo />
      </section>

      {/* Donation Form */}
      <section className="relative py-12 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="container mx-auto px-4">
          {/* Enhanced decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -left-10 top-1/4 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute right-0 bottom-1/4 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-4">
              Make Your Donation
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below to contribute to our cause
            </p>
          </motion.div>
          <DonationForm />
        </div>
      </section>
    </div>
  );
}