"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare } from "lucide-react";

interface FormData {
  fullname: string;
  email: string;
  message: string;
}

function ContactUs() {
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContactUs = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Fix: Remove unnecessary wrapping object
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ fullname: "", email: "", message: "" });
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        const errorData = await res.json();
        setError(
          errorData.error || "Failed to send message. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // Wrapper div for full-width background
    <div className="w-full bg-gradient-to-b from-white to-blue-50">
      {/* Content container */}
      <div className="w-[90%] md:w-4/5 mx-auto min-h-screen px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Section */}
          <motion.div
            className="w-full lg:w-1/3 flex flex-col justify-center space-y-6 p-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold text-blue-900 leading-tight">
              Contact us
            </h1>

            <p className="text-sm md:text-base lg:text-lg text-slate-800 font-medium leading-relaxed">
              In case you have any query, or want any details about the type of{" "}
              <span className="text-blue-900 font-bold">Donations</span> or
              want to donate/ Participate in Our
              <span className="text-blue-900 font-bold">
                {" "}
                Cycle Donation Drive.
              </span>
            </p>

            <h2 className="text-xl md:text-2xl text-slate-800 font-bold">
              Feel Free To Connect With Us!
            </h2>
          </motion.div>

          {/* Right Section - Form */}
          <motion.div
            className="w-full lg:w-2/3"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-blue-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
                  Get in Touch
                </h2>
                <Mail className="w-6 h-6 text-blue-900" />
              </div>

            <form onSubmit={handleContactUs} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullname"
                      required
                      className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                      placeholder="Your full name"
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    required
                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    placeholder="Write your message here..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-start">
                <motion.button
                  type="submit"
                  className="flex items-center justify-center space-x-2 w-full md:w-auto px-6 py-2.5 text-sm md:text-base font-medium text-white bg-blue-950 hover:bg-blue-900 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                </motion.button>
              </div>

              {/* Success/Error Messages */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {success && (
                  <p className="text-green-600 text-sm md:text-base text-center bg-green-50 p-3 rounded-lg">
                    Thank you for reaching out! We will get back to you shortly.
                  </p>
                )}
                {error && (
                  <p className="text-red-600 text-sm md:text-base text-center bg-red-50 p-3 rounded-lg">
                    {error}
                  </p>
                )}
              </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
