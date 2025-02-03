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
    <div className="w-full md:p-6 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <SkeletonBox />
            <SkeletonBox />
            <SkeletonBox />
            <SkeletonBox />
          </>
        ) : error ? (
          <div className="col-span-full p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            {error}
          </div>
        ) : products?.length === 0 ? (
          <div className="col-span-full p-4 text-sm text-gray-800 rounded-lg bg-gray-50">
            No Drives Found
          </div>
        ) : (
          products?.slice(0, noOfDrives)?.map((product, index) => (
            <div
              key={index}
              className="md:max-w-sm bg-white border border-gray-200 rounded-lg shadow"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h5 className="text-xl font-bold tracking-tight text-gray-800">
                    {product?.title}
                  </h5>
                  <span
                    className={`inline-flex items-center -tracking-tighter text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      product?.status === "active"
                        ? "bg-green-100 py-2 px-1 text-green-800"
                        : product?.status === "completed"
                          ? "bg-yellow-100 py-2 px-1 text-yellow-800"
                          : "bg-red-100 py-2 px-1 text-red-800"
                    }`}
                  >
                    {product?.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <GoLocation className="w-4 h-4 mr-2" />
                    {product?.location}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MdTimer className="w-4 h-4 mr-2" />
                    {product?.timeInterval}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MdOutlineAccessTime className="w-4 h-4 mr-2" />
                    <span>
                      {product?.startDate} - {product?.EndDate}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <IoArrowRedoCircleSharp className="w-4 h-4 mr-2" />
                    {product?.dtype} Donations
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <IoArrowRedoCircleSharp className="w-4 h-4 mr-2" />
                    {product?.photos.length} Photos
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link href={`drives/${product.id}`} className="flex-1">
                    <Button className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center text-slate-200 bg-gray-200 rounded-lg hover:bg-gray-300 ">
                      <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                      Update
                    </Button>
                  </Link>
                  <Button
                    onClick={() => deleteDrive(product?.id)}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500"
                  >
                    <AiOutlineDelete className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {products && products.length > noOfDrives && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() =>
              setNoOfDrives((prev) => (prev !== null ? prev + 4 : 4))
            }
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}
