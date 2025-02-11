import React from "react";
import CalendarComponent from "@/components/drive/calender";
import DriveEvents from "@/components/drive/driveEvents";
import { DriveCards } from "@/components/drive/driveCards";
import DriveAccordian from "@/components/drive/driveAccordian";
import { Card, CardContent } from "@/components/ui/card";

const renderHeading = () => {
  return (
    <div
      className="p-4"
      // className="max-w-3xl"
    >
      <h1 className="text-8xl font-medium tracking-tighter md:text-6xl md:font-medium text-gray-800 mb-4">
        Drive
        <span className=" md:text-[15px] text-[25px] -tracking-tight text-blue-600 italic block mt-5 font-semibold">
          # Explore about the upcoming drives and events
        </span>
      </h1>
      <p className=" text-gray-500 font-semibold -tracking-tight text-md md:text-sm leading-relaxed">
        Pasaydan Foundation organizes drives to donate blankets, bicycles, and
        food to underprivileged students and communities. These initiatives aim
        to provide essential resources to those in need, especially during
        winter. You can contribute by donating items, volunteering, or offering
        financial support to help continue these efforts.
      </p>
    </div>
  );
};

export default function Drive() {
  return (
    <div className="container w-[94%] md:w-[90%] mx-auto py-8 px-1">
      <div className="flex flex-col-reverse md:flex-row gap-8 lg:gap-5">
        <aside className="w-full md:w-[30%]">
          <div className="sticky w-full">
              <CalendarComponent />
              <DriveAccordian />
          </div>
        </aside>

        <main className="w-full md:w-[70%] md:space-y-8">
          {renderHeading()}
          <div className="md:w-full w-full mb-10 flex flex-wrap gap-2">
            <DriveCards />
          </div>
        </main>
      </div>
    </div>
  );
}
