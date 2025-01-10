import React from "react";
import CalendarComponent from "@/components/drive/calender";
import DriveEvents from "@/components/drive/driveEvents";
import { DriveCards } from "@/components/drive/driveCards";
import DriveAccordian from "@/components/drive/driveAccordian";
import { Card, CardContent } from "@/components/ui/card";

export default function Drive() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col-reverse md:flex-row gap-8 lg:gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="sticky top-24 space-y-6">
            <Card className="shadow-md bg-white">
              <CardContent className="p-4">
                <CalendarComponent />
              </CardContent>
            </Card>
            
            <Card className="shadow-md bg-white">
              <CardContent className="p-4">
                <DriveAccordian />
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4 space-y-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-950 mb-4">
              Drive
            </h1>
            <Card className="bg-blue-50/50">
              <CardContent className="p-6">
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

          {/* Drive Cards Grid */}
          <div className="md:w-full w-full mb-10 flex flex-wrap gap-2">
            <DriveCards />
          </div>
        </main>
      </div>
    </div>
  );
}


{/*import React from "react";
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
}*/}
