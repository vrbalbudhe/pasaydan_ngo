"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Home, Users, Heart, Info, MapPin, Facebook, Twitter, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <footer className="w-full">
      <div className="w-[90%] md:w-[80%] mx-auto py-12 md:py-16">
        {/* Main Footer Content */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* About Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-white">पसायदान</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Empowering communities through compassion and action. Join us in making a difference in the lives of those in need.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <Home className="w-4 h-4" />
                  <span className="group-hover:translate-x-1 transition-transform">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/pasaydan/com/donate" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <Heart className="w-4 h-4" />
                  <span className="group-hover:translate-x-1 transition-transform">Donate</span>
                </Link>
              </li>
              <li>
                <Link href="/pasaydan/com/drive" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <ExternalLink className="w-4 h-4" />
                  <span className="group-hover:translate-x-1 transition-transform">Drive</span>
                </Link>
              </li>
              <li>
                <Link href="/pasaydan/com/certification" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <Users className="w-4 h-4" />
                  <span className="group-hover:translate-x-1 transition-transform">Certification</span>
                </Link>
              </li>
              <li>
                <Link href="/pasaydan/com/community" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <Info className="w-4 h-4" />
                  <span className="group-hover:translate-x-1 transition-transform">Community</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+1234567890" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 1234567890</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@pasaydan.org" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@pasaydan.org</span>
                </a>
              </li>
              <li className="text-slate-300 inline-flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Near Vishrantwadi, Pune 412105, Maharashtra, India</span>
              </li>
            </ul>
          </motion.div>

        </motion.div>

        {/* Footer Bottom */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-blue-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm"
        >
          <p>© {currentYear} पसायदान. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}