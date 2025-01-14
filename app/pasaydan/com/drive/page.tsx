import React from "react";
import CalendarComponent from "@/components/drive/calender";
import DriveEvents from "@/components/drive/driveEvents";
import { DriveCards } from "@/components/drive/driveCards";
import DriveAccordian from "@/components/drive/driveAccordian";
import { Card, CardContent } from "@/components/ui/card";

const renderHeading = () => {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-950 mb-4">
        Drive
      </h1>
      <Card className=" border-none shadow-none">
        <CardContent className="p-3">
          <p className="text-base text-slate-700 leading-relaxed">
            Pasaydan Foundation organizes drives to donate blankets, bicycles,
            and food to underprivileged students and communities. These
            initiatives aim to provide essential resources to those in need,
            especially during winter. You can contribute by donating items,
            volunteering, or offering financial support to help continue these
            efforts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Drive() {
  return (
    <div className="container md:w-[95%] mx-auto py-8 px-4">
      <div className="flex flex-col-reverse md:flex-row gap-8 lg:gap-5">
        <aside className="w-full md:w-[35%]">
          <div className="sticky  top-24 space-y-6 w-full">
            <Card className="shadow-none border-none bg-white">
              <CardContent className="w-full">
                <CalendarComponent />
              </CardContent>
            </Card>

            <Card className="shadow-none w-full bg-white border-none">
              <CardContent className="p-4">
                <DriveAccordian />
              </CardContent>
            </Card>
          </div>
        </aside>

        <main className="w-full md:w-3/4 space-y-8">
          {renderHeading()}
          <div className="md:w-full w-full mb-10 flex flex-wrap gap-2">
            <DriveCards />
          </div>
        </main>
      </div>
    </div>
  );
}
