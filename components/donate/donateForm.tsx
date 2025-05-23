"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Phone,
  Mail,
  Home,
  Package,
  Hash,
  Image as ImageIcon,
  X,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function DonationForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      // Create preview URLs
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
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

      // Create FormData object
      const formPayload = new FormData();

      // Append text fields
      formPayload.append("fullname", formData.fullname);
      formPayload.append("mobile", formData.mobile);
      formPayload.append("email", formData.email);
      formPayload.append("address", address);
      formPayload.append("type", donateType);
      formPayload.append("quantity", formData.quantity);

      // Append image files
      files.forEach((file) => {
        formPayload.append("photos", file);
      });

      const response = await fetch("/api/donation/request", {
        method: "POST",
        body: formPayload, // No headers - browser sets correct Content-Type
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit the request.");
      }

      alert("Donation request submitted successfully!");

      // Reset all form states
      setFormData({
        fullname: "",
        mobile: "",
        email: "",
        quantity: "",
      });
      setAddress("");
      setDonateType("");
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error("Error submitting donation request:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to submit donation request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-12 md:py-20">
      {/* Blob Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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
          className="absolute bottom-1/4 left-20 w-[350px] h-[350px] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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
            <h1 className="text-5xl sm:text-5xl text-gray-800 lg:text-6xl tracking-tight xl:text-7xl leading-tight text-semibold">
              <span className="text-[#0496ff] font-bold">Donate</span> What You
              Can Spare <br />
              and Make a <br />
              <span className="text-[#0496ff] font-bold">Difference</span>
            </h1>
            <p className="mt-6 text-md text-gray-800 font-lexend max-w-xl mx-auto lg:mx-0">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-none shadow-md border border-blue-100 p-6 sm:p-8 md:p-10">
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Upload Donation Photos
                  </Label>
                  <div className="flex flex-col gap-4">
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <p className="text-gray-500">
                          Click to upload photos or drag and drop
                        </p>
                        <p className="text-sm text-gray-400">
                          Maximum 5 images (JPEG, PNG)
                        </p>
                      </div>
                    </div>

                    {previews.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {previews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="h-32 w-full object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
