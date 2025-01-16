"use client";

import React, { useEffect, useState, useRef } from "react";
import { GiDiamondTrophy } from "react-icons/gi";
import { IoMdBicycle } from "react-icons/io";
import { LuMessagesSquare } from "react-icons/lu";
import { FaGlobeAfrica } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricsState {
  awards: number;
  bicycles: number;
  globalSupport: number;
  comments: number;
}

const MetricCard: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
  delay: number;
}> = ({ icon, value, label, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="relative flex flex-col items-center p-4 sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-300 overflow-hidden group bg-white/90 backdrop-blur border-2 border-blue-100">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            className="text-blue-900 mb-4 transform transition-transform duration-300 group-hover:scale-110"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {React.cloneElement(icon as React.ReactElement, {
              className: "text-4xl sm:text-5xl md:text-7xl",
            })}
          </motion.div>

          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-2"
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {Math.floor(value)}+
          </motion.h2>

          <p className="text-sm sm:text-base md:text-lg text-blue-700 font-medium">
            {label}
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-blue-100 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500" />
        <div className="absolute -left-12 -top-12 w-24 h-24 bg-purple-100 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500" />
      </Card>
    </motion.div>
  );
};

const Metrics: React.FC = () => {
  const targetValues: MetricsState = {
    awards: 100,
    bicycles: 100,
    globalSupport: 845,
    comments: 15000,
  };

  const [metrics, setMetrics] = useState<MetricsState>({
    awards: 0,
    bicycles: 0,
    globalSupport: 0,
    comments: 0,
  });

  const [hasAnimated, setHasAnimated] = useState(false);
  const metricsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (metricsRef.current) {
      observer.observe(metricsRef.current);
    }

    return () => {
      if (metricsRef.current) {
        observer.unobserve(metricsRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 2000;
    const intervalTime = 50;
    const steps = duration / intervalTime;

    const incrementValues = {
      awards: targetValues.awards / steps,
      bicycles: targetValues.bicycles / steps,
      globalSupport: targetValues.globalSupport / steps,
      comments: targetValues.comments / steps,
    };

    const interval = setInterval(() => {
      setMetrics((prevMetrics) => {
        const nextMetrics = {
          awards: Math.min(
            prevMetrics.awards + incrementValues.awards,
            targetValues.awards
          ),
          bicycles: Math.min(
            prevMetrics.bicycles + incrementValues.bicycles,
            targetValues.bicycles
          ),
          globalSupport: Math.min(
            prevMetrics.globalSupport + incrementValues.globalSupport,
            targetValues.globalSupport
          ),
          comments: Math.min(
            prevMetrics.comments + incrementValues.comments,
            targetValues.comments
          ),
        };

        if (
          Object.entries(nextMetrics).every(
            ([key, value]) => value >= targetValues[key as keyof MetricsState]
          )
        ) {
          clearInterval(interval);
        }

        return nextMetrics;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [hasAnimated, targetValues]);

  return (
    <div ref={metricsRef} className="relative  py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
            THE GOAL:
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              {" "}
              1 MILLION BICYCLES
            </span>
            <br className="sm:hidden" />
            <span className="text-blue-900"> BY 2025</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <MetricCard
            icon={<GiDiamondTrophy />}
            value={metrics.awards}
            label="Awards Won"
            delay={0.1}
          />
          <MetricCard
            icon={<IoMdBicycle />}
            value={metrics.bicycles}
            label="Bicycles Delivered"
            delay={0.2}
          />
          <MetricCard
            icon={<FaGlobeAfrica />}
            value={metrics.globalSupport}
            label="Global Support"
            delay={0.3}
          />
          <MetricCard
            icon={<LuMessagesSquare />}
            value={metrics.comments}
            label="Comments"
            delay={0.4}
          />
        </div>
      </div>
    </div>
  );
};

export default Metrics;
