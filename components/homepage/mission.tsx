"use client";

import React from "react";
import { FaQuoteLeft } from "react-icons/fa"; // For the quote icon
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Utility for merging classes

const Mission: React.FC = () => {
  return (
    <div>
      {/* Heading */}
      <h2 className="text-5xl font-bold text-slate-900 text-center mb-20">Our Vision and Mission</h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        {/* Vision Card */}
        <Card className="w-96 shadow-md border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#032d60] text-center">Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <FaQuoteLeft className="text-3xl text-[#032d60] mb-4" />
              <CardDescription className="text-center text-lg">
                To prescribe - by preach or by practice - the remedy to human suffering, whether spiritual, moral, physical, or material.
              </CardDescription>
            </div>
          </CardContent>
        </Card>

        {/* Mission Card */}
        <Card className="w-96 shadow-md border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#032d60] text-center">Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <FaQuoteLeft className="text-3xl text-[#032d60] mb-4" />
              <CardDescription className="text-center text-lg">
                To adopt ways and means for the spiritual, moral & material progress of society based on Indian culture and traditions...
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Mission;
