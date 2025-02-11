"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Phone, Mail, Home, Package, Hash } from "lucide-react";
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
    console.log(formData);
    console.log(address);
    console.log(donateType);
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
    <div className="relative min-h-screen py-12 md:py-20">
      {/* Blob Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-20 w-[350px] h-[350px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-5xl text-gray-800 lg:text-6xl xl:text-7xl leading-tight text-semibold">
              <span className="text-[#1a237e] font-bold">Donate</span> What
              You Can Spare <br />
              and Make a <br />
              <span className="text-[#1a237e] font-bold">Difference</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
              Your contribution can change lives. Every donation, no matter how
              small, makes a significant impact on someone's life.
            </p>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullname"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Heart className="w-5 h-5" />
                    </span>
                    <Input
                      type="text"
                      id="fullname"
                      name="fullname"
                      placeholder="Enter your full name"
                      value={formData.fullname}
                      onChange={handleChange}
                      className="pl-10 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="mobile"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone className="w-5 h-5" />
                    </span>
                    <Input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      placeholder="Enter your mobile number"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="pl-10 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </span>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Address
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Home className="w-5 h-5" />
                    </span>
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-10 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="donateType"
                    className="text-sm font-medium text-gray-700"
                  >
                    Donation Type
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                      <Package className="w-5 h-5" />
                    </span>
                    <Select onValueChange={(value) => setDonateType(value)}>
                      <SelectTrigger
                        id="donateType"
                        className="pl-10 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <SelectValue placeholder="Select donation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blankets">Blankets</SelectItem>
                        <SelectItem value="cycle">Cycle</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="quantity"
                    className="text-sm font-medium text-gray-700"
                  >
                    Quantity
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Hash className="w-5 h-5" />
                    </span>
                    <Input
                      type="number"
                      id="quantity"
                      name="quantity"
                      placeholder="Enter quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="pl-10 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1a237e] hover:bg-[#283593] text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        <span>Submit Donation</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

{
  /*"use client";
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
}*/
}
