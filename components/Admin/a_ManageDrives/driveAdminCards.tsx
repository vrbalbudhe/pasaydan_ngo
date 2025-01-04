"use client";
import * as React from "react";
import { GoLocation } from "react-icons/go";
import { BiDonateHeart } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";
import { IoArrowRedoCircleSharp } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import SkeletonBox from "@/components/skeleton";

export function AdminDriveCards() {
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

  const deleteDrive = async (id: string) => {
    try {
      const response = await fetch(`/api/drive/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete drive");
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error deleting drive:", error);
      alert("Error deleting drive");
    }
  };

  const toggleReadMore = (index: number) => {
    setReadMore((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full flex p-5 flex-wrap justify-start gap-5 items-start py-4">
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
            className="md:w-[500px] w-full bg-gradient-to-tr shadow-sm hover:shadow-md rounded-lg "
          >
            <CardHeader className="h-30 pb-4">
              <CardTitle className="font-semibold text-2xl text-slate-800">
                {product?.title}
              </CardTitle>
              <CardDescription className="text-sm text-slate-800">
                <div className="flex gap-4 flex-col">
                  <div className="text-slate-600 flex gap-2 items-center">
                    <GoLocation className="text-slate-800 text-lg" />
                    <p className="text-sm text-slate-800">
                      {product?.location}
                    </p>
                  </div>
                  <h1 className="flex justify-start items-center gap-2 text-slate-800">
                    <MdTimer className="text-slate-800 text-lg" />
                    {product?.timeInterval}
                  </h1>
                  <div className="text-slate-600 flex font-semibold gap-2 items-center">
                    <MdOutlineAccessTime className="text-slate-800 text-lg" />
                    {product?.startDate} - {product?.EndDate}
                  </div>
                  <div className="text-slate-600 flex gap-2 items-center">
                    <IoArrowRedoCircleSharp className="text-slate-800 text-lg" />
                    <p className="text-sm text-slate-800">
                      {product?.dtype} Donations
                    </p>
                  </div>
                  <div className="text-slate-600 flex gap-2 items-center">
                    <IoArrowRedoCircleSharp className="text-slate-800 text-lg" />
                    <p className="text-sm text-slate-800">
                      {product?.photos.length} Photos
                    </p>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center pt-4 gap-3">
              <Link href={`drives/${product.id}`}>
                <Button className="bg-teal-500 text-white hover:bg-teal-600 rounded-lg shadow-sm px-4 py-2 flex items-center gap-2">
                  <FaExternalLinkAlt />
                  Update
                </Button>
              </Link>
              <Button
                onClick={() => deleteDrive(product?.id)}
                className="bg-red-500 text-white hover:bg-red-600 rounded-lg shadow-sm px-4 py-2 flex items-center gap-2"
              >
                <AiOutlineDelete />
                Delete
              </Button>
              <div className="flex justify-center items-center gap-2">
                {product?.status === "pending" ? (
                  <div className="w-5 h-5 flex justify-center items-center bg-green-500 rounded-full">
                    <p className="w-3 h-3 bg-[#001524] rounded-full"></p>
                  </div>
                ) : (
                  <div className="w-5 h-5 flex justify-center items-center bg-yellow-500 rounded-full">
                    <p className="w-3 h-3 bg-[#001524] rounded-full"></p>
                  </div>
                )}
                <p className="text-sm text-slate-800">{product?.status}</p>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
      {products && noOfDrives > 4 && (
        <div className="w-full md:mt-12 h-12 bg-[#2d232e] bottom-0 flex justify-center items-center rounded-sm">
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white"
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
}