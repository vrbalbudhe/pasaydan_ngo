"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import dynamic from "next/dynamic";

// Dynamically load the Map component
// const Map = dynamic(() => import("@/components/donate/map"), { ssr: false });

export default function DonationForm() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [address, setAddress] = useState("");

  // Use Geolocation API to get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", {
      // name: e.target.name.value,
      // mobile: e.target.mobile.value,
      // email: e.target.email.value,
      // address,
      // donateType: e.target.donateType.value,
      // quantity: e.target.quantity.value,
      // location,
    });
    // Logic to handle form submission
  };

  return (
    <div className="w-[90%] min-h-screen md:flex justify-between items-center gap-5">
      <div className="w-full md:w-1/2 md:h-[600px] p-5 flex justify-center items-center">
        <h1 className="text-5xl md:text-7xl tracking-tighter text-center text-gray-800">
          <span className="text-blue-700 font-semibold md:text-[80px]">
            {" "}
            Donate{" "}
          </span>
          What You Can Spare and Make a
          <span className="text-blue-700 font-semibold md:text-[80px]">
            {" "}
            Difference
          </span>
        </h1>

        <div className="flex flex-col absolute left-[700px] w-40 items-center mt-4">
          {/* Line */}
          <img
            // src="https://media4.giphy.com/media/JR1p5Y2rcHzUhkYKgM/giphy.gif?cid=6c09b9523mb9lb4pkm5q2olfpjyjoxg55drql7psbl4l55j2&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s"
            src="https://i.pinimg.com/originals/44/67/ce/4467ceda95866abb6e9060609fc81360.gif"
            alt="Animated Arrow"
            className="mt-4 w-20 h-20"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 h-full p-5">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-lg bg-white mx-auto p-4 border rounded-xl shadow-md"
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              type="tel"
              id="mobile"
              name="mobile"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="donateType">Donate Type</Label>
            <Select>
              <SelectTrigger id="donateType" name="donateType">
                <SelectValue placeholder="Select donation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blankets">Blankets</SelectItem>
                <SelectItem value="cycle">Cycle</SelectItem>
                <SelectItem value="food">Food</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Enter quantity"
              required
            />
          </div>

          {/* Optional Map Display Section */}
          {/* <div>
            <Label>Location</Label>
            <div className="h-64 w-full">
              <Map onLocationChange={handleLocationChange} location={location} />
            </div>
            <p>
              Selected Location: Lat {location.lat}, Lng {location.lng}
            </p>
          </div> */}

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}
