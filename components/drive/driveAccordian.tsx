import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TbInfoSquareRounded } from "react-icons/tb";

export default function DriveAccordion() {
  const informationDict = [
    {
      Head: "Is this drive timings are volatile?",
      Content:
        "Mostly Drives timings are not volatile, but if we want to reschedule we will inform it on prior basis.",
      Icon: "🕒"
    },
    {
      Head: "What is the schedule?",
      Content: "The drive is scheduled for 15th December, 2024.",
      Icon: "📅"
    },
    {
      Head: "How to participate in this drives?",
      Content:
        "Just Be in the location on given timings our pasaydan will catch your attention.",
      Icon: "🤝"
    },
    {
      Head: "How to participate?",
      Content: "Sign up on our platform and confirm your slot.",
      Icon: "✍️"
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-950">
          <TbInfoSquareRounded className="w-5 h-5" />
          Drive Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-2"
        >
          {informationDict.map((info, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className="border rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <AccordionTrigger className="flex gap-3 text-left hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{info.Icon}</span>
                  <span className="text-sm font-medium text-blue-950">
                    {info.Head}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-1 pl-9">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {info.Content}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

{/*import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TiInfoLargeOutline } from "react-icons/ti";
import { TbInfoSquareRounded } from "react-icons/tb"
export default function DriveAccordian() {
  const informationDict = [
    {
      Head: "Is this drive timings are volatile?",
      Content:
        "Mostly Drives timings are not volatile, but if we want to reschedule we will inform it on prior basis.",
    },
    {
      Head: "What is the schedule?",
      Content: "The drive is scheduled for 15th December, 2024.",
    },
    {
      Head: "How to participate in this drives?",
      Content:
        "Just Be in the location on given timings our pasaydan will catch your attention.",
    },
    {
      Head: "How to participate?",
      Content: "Sign up on our platform and confirm your slot.",
    },
  ];

  return (
    <div className="mt-10 w-full">
      <div>
        <h1 className="text-md  flex justify-start items-center gap-1 text-blue-600 hover:underline mb-2 cursor-pointer">
          <span className="inline text-xl text-black">
            <TbInfoSquareRounded />
          </span>
          Drive Information
        </h1>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {informationDict.map((info, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger className="text-md">
              {index + 1}
              {". "} {info.Head}
            </AccordionTrigger>
            <AccordionContent className="text-blue-600 italic -tracking-tight">
              {"> "}
              {info.Content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
} */}
