import React from "react";
import CalendarComponent from "@/components/drive/calender";
import DriveEvents from "@/components/drive/driveEvents";
import { DriveCards } from "@/components/drive/driveCards";
import DriveAccordian from "@/components/drive/driveAccordian";
import { Card, CardContent } from "@/components/ui/card";

const renderHeading = () => {
  return (
    <div
      className="p-4 w-full md:w-[80%] text-center min-h-80 flex flex-col md:justify-center md:items-center"
      // className="max-w-3xl"
    >
      <h1 className="text-6xl tracking-tight md:text-6xl font-semibold text-gray-800 mb-4">
        <span className="text-[#0496ff]">Drives </span>
        <span className="font-medium">For </span>
        Humanity
      </h1>
      <p className=" text-gray-700 font-medium font-lexend -tracking-tight text-md md:text-md leading-relaxed">
        <span className="text-[#0496ff] font-medium">Pasaydan Foundation </span>
        organizes drives to donate blankets, bicycles, and food to
        underprivileged students and communities. These initiatives aim to
        provide essential resources to those in need, especially during winter.
        You can contribute by donating items, volunteering, or offering
        financial support to help continue these efforts.
      </p>
    </div>
  );
};

export default function Drive() {
  return (
    <div className="container w-[94%] md:w-[100%] md:flex mx-auto py-8 px-1">
      <main className="w-full md:w-[100%] min-h-fit md:flex md:flex-col md:justify-center md:items-center">
        {renderHeading()}
        <div className="md:w-full w-full md:mb-10 flex flex-wrap gap-2">
          <DriveCards />
        </div>
        <aside className="w-full md:w-[100%] min-h-fit flex justify-center items-center ">
          <div className="w-full flex justify-center items-center">
            <CalendarComponent />
          </div>
        </aside>
        <div className="md:w-[90%] w-full">
          <DriveAccordian />
        </div>
      </main>
    </div>
  );
}
