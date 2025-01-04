"use client";
import { useState } from "react";
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

export default function DonationForm() {
  const [address, setAddress] = useState("");
  const [donateType, setDonateType] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    mobile: "",
    email: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullname ||
      !formData.mobile ||
      !formData.email ||
      !address ||
      !donateType ||
      !formData.quantity
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/donation/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          mobile: formData.mobile,
          email: formData.email,
          address,
          type: donateType,
          quantity: formData.quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the request.");
      }

      alert("Donation request submitted successfully!");
      setFormData({
        fullname: "",
        mobile: "",
        email: "",
        quantity: "",
      });
      setAddress("");
      setDonateType("");
    } catch (error) {
      console.error("Error submitting donation request:", error);
      alert("Failed to submit donation request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] min-h-screen md:flex justify-between items-center gap-5">
      <div className="w-full md:w-1/2 md:h-[600px] p-5 flex justify-center items-center">
        <h1 className="text-5xl md:text-7xl tracking-tighter text-center text-gray-800">
          <span className="text-blue-700 font-semibold md:text-[80px]">
            Donate
          </span>{" "}
          What You Can Spare and Make a{" "}
          <span className="text-blue-700 font-semibold md:text-[80px]">
            Difference
          </span>
        </h1>
      </div>

      <div className="w-full md:w-1/2 h-full p-5">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-lg bg-white mx-auto p-4 border rounded-xl shadow-md"
        >
          <div>
            <Label htmlFor="fullname">Name</Label>
            <Input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Enter your name"
              value={formData.fullname}
              onChange={handleChange}
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
              value={formData.mobile}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
            <Select onValueChange={(value) => setDonateType(value)}>
              <SelectTrigger id="donateType">
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
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
