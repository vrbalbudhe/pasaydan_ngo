"use client";
import * as React from "react";
import { GoLocation } from "react-icons/go";
import { BiDonateHeart } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdTimer, MdOutlineAccessTime } from "react-icons/md";
import { IoArrowRedoCircleSharp } from "react-icons/io5";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SkeletonBox from "../skeleton";
import Link from "next/link";

export function DriveCards() {
  const [error, setError] = React.useState<string | null>(null);
  const [noOfDrives, setNoOfDrives] = React.useState<number | 4>(6);
  const [products, setProducts] = React.useState<any[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [readMore, setReadMore] = React.useState<{ [key: number]: boolean }>(
    {}
  );

  React.useEffect(() => {
    const fetchDrives = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/drive`);
        if (!response.ok) throw new Error("Failed to fetch drives");
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching drives");
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, []);

  const getStatusStyles = (status: string) => {
    return status === "pending"
      ? "bg-gradient-to-r from-green-400 to-green-500 ring-blue-950/20"
      : "bg-gradient-to-r from-yellow-400 to-yellow-500 ring-blue-950/20";
  };

  if (loading) {
    return (
      <div className="w-fit h-screen flex flex-wrap justify-center items-start">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonBox key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="w-full p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
        No Drives Found
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full min-h-fit flex flex-wrap justify-center items-start gap-3 ">
        {products?.slice(0, noOfDrives)?.map((product, index) => (
          <Card
            key={index}
            className="w-full md:w-[380px] bg-[#fbfbff] border shadow-md rounded-none min-h-fit overflow-hidden transition-all duration-300 "
          >
            <CardHeader className="">
              <div className="flex justify-between items-start mb-5">
                <CardTitle className="text-2xl text-[#0496ff] cursor-pointer font-medium">
                  {product?.title}
                </CardTitle>
                <div
                  className={`w-4 h-4 rounded-full ${getStatusStyles(product?.status)}`}
                />
              </div>

              <CardDescription className="w-full h-full flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <GoLocation className="text-slate-800 text-xl flex-shrink-0" />
                  <span className="text-sm">{product?.location}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <MdTimer className="text-slate-800 text-xl flex-shrink-0" />
                  <span className="text-sm">{product?.timeInterval}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <MdOutlineAccessTime className="text-slate-800 text-xl flex-shrink-0" />
                  <span className="text-sm">
                    {product?.startDate} - {product?.EndDate}
                  </span>
                </div>
                <div className="flex items-center gap-2  text-gray-700">
                  <IoArrowRedoCircleSharp className="text-slate-800 text-xl flex-shrink-0" />
                  <span className="text-sm">{product?.dtype} Donations</span>
                </div>
              </CardDescription>
            </CardHeader>

            <CardFooter className="">
              <Link href={`drive/${product.id}`} className="w-full">
                <div className="w-2/3 md:w-1/2 flex justify-center hover:text-[#0496ff] items-center px-3 py-2 border border-gray-300 md:hover:bg-gray-800 text-white bg-gray-800 rounded-sm shadow-md">
                  <span className="flex-1 text-white font-semibold">
                    Show Details
                  </span>
                  <FaExternalLinkAlt className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {products && products.length > noOfDrives && (
        <div className="w-full flex justify-center md:mt-10">
          <div
            className="w-full md:w-fit text-center md:text-left bg-inherit text-gray-800 hover:text-[#0496ff] hover:font-semibold px-2 py-3 rounded-none cursor-pointer font-medium text-sm bg-blue-600"
            onClick={() =>
              setNoOfDrives((prev) => (prev !== null ? prev + 4 : 4))
            }
          >
            Show More
          </div>
        </div>
      )}
    </div>
  );
}
