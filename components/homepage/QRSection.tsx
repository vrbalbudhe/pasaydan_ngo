'use client';
import React, { useEffect, useRef } from 'react';
import QRious from 'qrious';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const QRSection = () => {
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (qrRef.current) {
      new QRious({
        element: qrRef.current,
        value: '/pasaydan/com/donation', // Replace with your actual donation form URL
        size: 200,
        backgroundAlpha: 0,
        foreground: '#1e40af', // Deep blue color matching your theme
        level: 'H', // Highest error correction level
      });
    }
  }, []);

  return (
    <div className="w-full py-16 ">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <Card className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Left side - Text Content */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              Scan & Support
            </h2>
            <p className="text-lg text-gray-600 max-w-xl">
              Make a difference with a simple scan. Your generous contribution helps us provide food, blankets, and bicycles to those in need. Every donation brings us closer to our goal of creating positive change in our community.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-gray-700">Instant Access</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-gray-700">Secure Process</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-700">Quick & Easy</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-gray-700">Track Impact</span>
              </div>
            </div>
          </div>

          {/* Right side - QR Code */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-3 scale-105" />
            <div className="relative bg-white p-6 rounded-lg shadow-sm">
              <canvas ref={qrRef} className="w-[200px] h-[200px]" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QRSection;