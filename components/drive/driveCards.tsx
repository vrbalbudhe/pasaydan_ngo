"use client";
import * as React from "react";
import { GoLocation } from "react-icons/go";
import { BiDonateHeart } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";
import { IoArrowRedoCircleSharp } from "react-icons/io5";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SkeletonBox from "../skeleton";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
export function DriveCards() {
  const [error, setError] = React.useState<string | null>(null);
  const [noOfDrives, setNoOfDrives] = React.useState<number | 4>(4);
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

  const toggleReadMore = (index: number) => {
    setReadMore((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full flex flex-wrap justify-start gap-3 items-start py-4">
      {loading ? (
        <div className="w-full flex flex-wrap justify-start items-center gap-5 mb-10 text-center text-slate-200">
          <SkeletonBox />
          <SkeletonBox />
          <SkeletonBox />
        </div>
      ) : error ? (
        <div className="w-full flex flex-wrap justify-start items-center gap-5 mb-10 text-center text-red-500">
          <SkeletonBox />
          <SkeletonBox />
          <SkeletonBox />
        </div>
      ) : products?.length === 0 ? (
        <div className="w-full text-center text-slate-300">No Drives Found</div>
      ) : (
        products?.slice(0, noOfDrives)?.map((product, index) => (
          <Card
            key={index}
            className="md:w-[450px] w-full bg-[#2d232e] shadow-sm hover:shadow-md rounded-2xl border-none"
          >
            <CardHeader className="h-30">
              <CardTitle className="h-20 font-normal text-2xl text-white">
                {product?.title}
              </CardTitle>
              <CardDescription className="text-sm text-slate-300">
                <div className="flex gap-2 flex-col">
                  <div className="text-slate-600 flex gap-2 items-center">
                    <GoLocation className="text-white text-lg" />
                    <p className="text-sm -tracking-tight text-slate-100">
                      {product?.location}
                    </p>
                  </div>
                  <h1 className="flex justify-start items-center gap-2">
                    <span className="text-xl">
                      <MdTimer />
                    </span>
                    {product?.timeInterval}
                  </h1>
                  <div className="text-slate-600 flex font-semibold gap-2 items-center">
                    <MdOutlineAccessTime className="text-white text-lg" />
                    {product?.startDate} - {product?.EndDate}
                  </div>
                  <div className="text-slate-600 flex gap-2 items-center">
                    <IoArrowRedoCircleSharp className="text-white text-lg" />
                    <p className="text-sm -tracking-tight text-slate-100">
                      {product?.dtype} Donations
                    </p>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
              <Link href={`drive/${product.id}`}>
                <Button className="bg-white text-black hover:bg-gray-200">
                  {/* {product?.location} */}
                  Show Details
                  <FaExternalLinkAlt />
                </Button>
              </Link>
              <div className="text-sm text-slate-300">
                {product?.status === "pending" ? (
                  <div className="w-5 h-5 flex justify-center items-center bg-green-400 rounded-full">
                    <p className="w-3 h-3 bg-[#001524] rounded-full"></p>
                  </div>
                ) : (
                  <div className="w-5 h-5 flex justify-center items-center bg-yellow-400 rounded-full">
                    <p className="w-3 h-3 bg-[#001524] rounded-full"></p>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        ))
      )}
      <div className="w-full md:mt-12 h-12 bg-[#2d232e] bottom-0 flex justify-center items-center rounded-sm">
        <Button
          className="bg-inherit hover:bg-slate-600 text-slate-100 hover:text-white"
          onClick={() =>
            setNoOfDrives((prev) => (prev !== null ? prev + 4 : 4))
          }
        >
          Show More
        </Button>
      </div>
    </div>
  );
}
