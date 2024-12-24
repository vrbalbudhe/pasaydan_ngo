import {
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
}
