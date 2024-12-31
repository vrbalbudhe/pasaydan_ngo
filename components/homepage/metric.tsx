"use client";

import React, { useEffect, useState, useRef } from "react";
import { GiDiamondTrophy } from "react-icons/gi";
import { IoMdBicycle } from "react-icons/io";
import { LuMessagesSquare } from "react-icons/lu";
import { FaGlobeAfrica } from "react-icons/fa";
import { Card } from "@/components/ui/card"; // ShadCN card
import { cn } from "@/lib/utils"; // Utility for merging classes

interface MetricsState {
  awards: number;
  bicycles: number;
  globalSupport: number;
  comments: number;
}

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
      { threshold: 0.5 }
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
          nextMetrics.awards >= targetValues.awards &&
          nextMetrics.bicycles >= targetValues.bicycles &&
          nextMetrics.globalSupport >= targetValues.globalSupport &&
          nextMetrics.comments >= targetValues.comments
        ) {
          clearInterval(interval);
        }

        return nextMetrics;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [hasAnimated, targetValues]);

  return (
    <div
      ref={metricsRef}
      className={cn(
        "md:h-[500px] h-fit flex flex-col py-2 px-2 mt-20 mb-20 md:mt-0 md:mb-0 items-center justify-center text-gray-900"
      )}
    >
      <h1 className="text-slate-900 text-2xl px-5 md:px-0 md:text-4xl font-bold mb-20">
        THE GOAL: 1 MILLION BICYCLES BY 2025
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {/* Award Won */}
        <Card className="flex flex-col items-center p-6">
          <GiDiamondTrophy className="text-slate-800 text-4xl md:text-7xl mb-4" />
          <h2 className="text-2xl md:text-2xl font-bold">
            {Math.floor(metrics.awards)}+
          </h2>
          <p className="text-lg">Awards Won</p>
        </Card>

        {/* Bicycles Delivered */}
        <Card className="flex flex-col items-center p-6">
          <IoMdBicycle className="text-slate-800 text-4xl md:text-7xl mb-4" />
          <h2 className="text-2xl md:text-2xl font-bold">
            {Math.floor(metrics.bicycles)}+
          </h2>
          <p className="text-lg">Bicycles Delivered</p>
        </Card>

        {/* Global Support */}
        <Card className="flex flex-col items-center p-6">
          <FaGlobeAfrica className="text-slate-800 text-4xl md:text-7xl mb-4" />
          <h2 className="text-2xl md:text-2xl font-bold">
            {Math.floor(metrics.globalSupport)}+
          </h2>
          <p className="text-lg">Global Support</p>
        </Card>

        {/* Comments */}
        <Card className="flex flex-col items-center p-6">
          <LuMessagesSquare className="text-slate-800 text-4xl md:text-7xl mb-4" />
          <h2 className="text-2xl md:text-2xl font-bold">
            {Math.floor(metrics.comments)}+
          </h2>
          <p className="text-lg">Comments</p>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;
