"use client";
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { parseISO, isWithinInterval, eachDayOfInterval } from "date-fns";
import SkeletonTab from "../skeletonTab";
import { MdLocationOn } from "react-icons/md";
import { BsCalendar2Date } from "react-icons/bs";
import { TbInfoSquareRounded } from "react-icons/tb";
import { GoLocation } from "react-icons/go";
import { BsCalendar2Event } from "react-icons/bs";
import { Button } from "../ui/button";

type Product = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  EndDate: string;
  status: "pending" | "approved";
  dtype: "blood" | "food" | "clothes" | "blanket" | "cycle";
};

export default function CalendarComponent() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [products, setProducts] = React.useState<Product[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDrives = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/drive`);
        if (!response.ok) throw new Error("Failed to fetch drives");
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching drives");
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, []);

  const modifiers = React.useMemo(() => {
    if (!products) return {};

    const dateModifiers: Record<string, Date[]> = {};

    products.forEach((product) => {
      const startDate = parseISO(product.startDate);
      const endDate = parseISO(product.EndDate);

      eachDayOfInterval({ start: startDate, end: endDate }).forEach((date) => {
        const key =
          product.dtype.toLowerCase() as keyof typeof modifiersClassNames;
        if (!dateModifiers[key]) dateModifiers[key] = [];
        dateModifiers[key].push(date);
      });
    });

    return dateModifiers;
  }, [products]);

  const modifiersClassNames = {
    blood:
      "bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 rounded-full transform hover:scale-105",
    cycle:
      "bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 rounded-full transform hover:scale-105",
    blanket:
      "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-full transform hover:scale-105",
    food: "bg-orange-400 text-white hover:bg-orange-500 transition-colors duration-200 rounded-full transform hover:scale-105",
    default:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200 rounded-full",
  };

  return (
    <div className="w-full min-h-screen bg-inherit md:p-6">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonTab />
          <SkeletonTab />
          <SkeletonTab />
          <SkeletonTab />
        </div>
      ) : error ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-red-500">
          <SkeletonTab />
          <SkeletonTab />
          <SkeletonTab />
          <SkeletonTab />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {/* {products?.length && (
              <div className="flex items-center gap-3 mb-6">
                <BsCalendar2Event className="text-3xl text-blue-600" />
                <h1 className="text-3xl font-medium text-gray-800">
                  <span className="text-[#0496ff] font-bold">Upcoming </span>
                  Drives
                </h1>
              </div>
            )} */}
          <div className="w-full md:w-fit space-y-6">
            <div className="bg-white w-fit rounded-xl shadow-lg md:p-4 transition-all duration-300 hover:shadow-xl">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
              />
            </div>

            <div className="bg-white rounded-xl md:p-4 transition-all duration-300 border-none">
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg transition-all duration-300 hover:bg-green-600 hover:shadow-md">
                  Cycle
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg transition-all duration-300 hover:bg-red-600 hover:shadow-md">
                  Blood
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 hover:shadow-md">
                  Blanket
                </button>
                <button className="px-4 py-2 bg-orange-400 text-white rounded-lg transition-all duration-300 hover:bg-orange-500 hover:shadow-md">
                  Food
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="w-full h-full flex flex-wrap gap-2 justify-center items-center">
              {products
                ?.filter((product) => product.status === "pending")
                .map((product) => (
                  <div
                    key={product?.id}
                    className="bg-gray-800 md:w-72 w-full shadow-md rounded-md md:rounded-none p-3 border border-gray-200"
                  >
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-[#0496ff] transition-colors duration-300">
                        {product?.title}
                      </h2>

                      <div className="flex items-center gap-2 text-gray-300">
                        <MdLocationOn className="text-md text-white" />
                        <p className="font-medium text-md">
                          {product?.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-white">
                        <BsCalendar2Date className="text-sm" />
                        <p className="font-medium text-sm">
                          {product?.startDate} - {product?.EndDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
