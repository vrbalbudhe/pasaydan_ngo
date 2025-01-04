"use client";

import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

const Mission: React.FC = () => {
  return (
    <div>
      <h2 className="text-5xl font-bold text-slate-900 text-center mb-20">Our Vision and Mission</h2>

      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex flex-col space-y-8">
          {/* Vision Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 justify-start">
            <div className="md:ml-0">
              <Card className="w-[450px] shadow-md border">
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
            </div>
            <img 
              src="/api/placeholder/500/300" 
              alt="Vision illustration" 
              className="rounded-lg shadow-md"
            />
          </div>

          {/* Mission Section */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 justify-end">
            <div className="md:mr-0">
              <Card className="w-[450px] shadow-md border">
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
            <img 
              src="/api/placeholder/500/300" 
              alt="Mission illustration" 
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;