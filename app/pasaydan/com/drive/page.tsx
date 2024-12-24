import React from "react";
import CalendarComponent from "@/components/drive/calender";
import DriveEvents from "@/components/drive/driveEvents";
import { DriveCards } from "@/components/drive/driveCards";
import DriveAccordian from "@/components/drive/driveAccordian";
export default function drive() {
  return (
    <div className="w-[90%] min-h-full md:flex md:flex-row flex-col-reverse flex gap-10 justify-center items-start">
      <div
        style={{ scrollbarColor: "#000000" }}
        className="md:w-[25%] w-full md:min-h-screen pr-2 flex pb-20 flex-col gap-5 justify-start items-start"
      >
        <div className="w-full min-h-full overflow-y-visible">
          <CalendarComponent />
          <DriveAccordian />
        </div>
      </div>
      <div className="md:w-[75%] w-fit h-full flex flex-col md:mt-10 gap-10 justify-start items-start">
        <div className="md:w-[80%] h-full flex flex-col gap-5">
          <h1 className="text-5xl text-slate-800">Drive</h1>
          <p className="text-sm text-slate-700 -tracking-tight">
            Pasaydan Foundation organizes drives to donate blankets, bicycles,
            and food to underprivileged students and communities. These
            initiatives aim to provide essential resources to those in need,
            especially during winter. You can contribute by donating items,
            volunteering, or offering financial support to help continue these
            efforts.
          </p>
        </div>
        <div className="md:w-full w-full mb-10 flex flex-wrap gap-2">
          <DriveCards />
        </div>
      </div>
    </div>
  );
}
