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

  const getStatusStyles = (status: string) => {
    return status === "pending"
      ? "bg-gradient-to-r from-green-400 to-green-500 ring-blue-950/20"
      : "bg-gradient-to-r from-yellow-400 to-yellow-500 ring-blue-950/20";
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
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
      <div className="w-full h-full flex flex-wrap justify-start items-start gap-2 ">
        {products?.slice(0, noOfDrives)?.map((product, index) => (
          <Card
            key={index}
            className="w-full md:w-[450px] bg-white min-h-fit rounded-sm overflow-hidden shadow-lg hover:shadow-md transition-all duration-300 border border-gray-200"
          >
            <CardHeader className="">
              <div className="flex justify-between items-start mb-5">
                <CardTitle className="text-2xl text-blue-500 cursor-pointer font-medium">
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

                <div className="flex items-center gap-2">
                  <IoArrowRedoCircleSharp className="text-slate-800 text-xl flex-shrink-0" />
                  <Badge
                    variant="secondary"
                    className="bg-blue-500 border py-2 cursor-pointer rounded-full text-gray-700"
                  >
                    {product?.dtype} Donations
                  </Badge>
                </div>
              </CardDescription>
            </CardHeader>

            <CardFooter className="pt-4 pb-6">
              <Link href={`drive/${product.id}`} className="w-full">
                <div className="w-2/3 md:w-1/2 flex justify-center items-center px-3 py-3 border border-gray-300 md:hover:bg-zinc-800 text-white bg-gray-800 rounded-2xl shadow-md">
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
        <div className="w-full flex justify-start">
          <div
            className="w-full md:w-fit text-center md:text-left bg-inherit text-gray-800 px-2 py-3 border-2 rounded-xl cursor-pointer font-semibold text-sm bg-blue-600 border-gray-200 shadow-md"
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

{
  /*"use client";
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
            className="md:w-[450px] w-full bg-[#2d232e] shadow-sm hover:shadow-md rounded-lg border-none"
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
                  {/* {product?.location} */
}
{
  /*}  Show Details
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
      {products && noOfDrives > 4 && (
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
      )}
    </div>
  );
} */
}
