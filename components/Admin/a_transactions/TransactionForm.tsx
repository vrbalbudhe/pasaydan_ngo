"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  TransactionNature,
  UserType,
  TransactionStatus,
  MoneyForCategory,
} from "@prisma/client";

// Define our own constant for Payment Types (including "CASH")
const PAYMENT_TYPES = ["UPI", "NET_BANKING", "CARD", "CASH"] as const;
type PaymentType = typeof PAYMENT_TYPES[number];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// --- Zod Schema ---
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  amount: z.number().min(1, "Amount is required"),
  type: z.enum(PAYMENT_TYPES),
  transactionNature: z.enum(["CREDIT", "DEBIT"]),
  userType: z.enum(["INDIVIDUAL", "ORGANIZATION"]),
  date: z.string(), // ISO date string (YYYY-MM-DD)
  transactionId: z.string().optional(),
  screenshot: z
    .any()
    .refine(
      (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
      {
        message: "Max file size is 5MB",
      }
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      {
        message:
          "Only .jpg, .jpeg, .png and .webp formats are supported",
      }
    )
    .optional(),
  entryBy: z.string().min(2, "Entry by must be at least 2 characters"),
  makeDefaultEntry: z.boolean().default(false),
  description: z.string().optional(),
  status: z.enum(["PENDING", "REJECTED", "VERIFIED"]).default("PENDING"),
  moneyFor: z.enum([
    "CLOTHES",
    "FOOD",
    "CYCLE",
    "EDUCATION",
    "HEALTHCARE",
    "OTHER",
  ]),
  customMoneyFor: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function TransactionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get default entry name from localStorage
  const [defaultEntryName, setDefaultEntryName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("defaultEntryName") || "";
    }
    return "";
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      amount: 0,
      type: "CASH",
      transactionNature: "CREDIT",
      userType: "INDIVIDUAL",
      date: new Date().toISOString().split("T")[0],
      transactionId: "",
      entryBy: defaultEntryName,
      makeDefaultEntry: false,
      description: "",
      status: "PENDING",
      moneyFor: "OTHER",
      customMoneyFor: "",
    },
  });

  // Watch values for conditional rendering
  const makeDefaultEntry = form.watch("makeDefaultEntry");
  const entryBy = form.watch("entryBy");
  const moneyFor = form.watch("moneyFor");
  const paymentType = form.watch("type") as PaymentType;

  // Update localStorage when default entry changes
  useEffect(() => {
    if (makeDefaultEntry && entryBy) {
      localStorage.setItem("defaultEntryName", entryBy);
      setDefaultEntryName(entryBy);
    }
  }, [makeDefaultEntry, entryBy]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      form.setValue("screenshot", file);
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    form.setValue("screenshot", null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function onSubmit(data: FormData) {
    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      // Append all form fields (except screenshot)
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "screenshot" && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });
      // Append file if exists
      if (selectedFile) {
        formDataToSend.append("screenshot", selectedFile);
      }
      const response = await fetch("/api/admin/transactions", {
        method: "POST",
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }
      toast.success("Transaction added successfully");
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add transaction");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* Basic Details Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount Field */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={
                      typeof field.value === "number" && !isNaN(field.value)
                        ? field.value
                        : ""
                    }
                    onChange={(e) => {
                      const { value } = e.target;
                      // Pass 0 if empty, otherwise convert to number
                      const numberValue = value === "" ? 0 : Number(value);
                      field.onChange(numberValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Payment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYMENT_TYPES.map((pt) => (
                      <SelectItem key={pt} value={pt}>
                        {pt.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transaction Nature */}
          <FormField
            control={form.control}
            name="transactionNature"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nature</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nature" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["CREDIT", "DEBIT"].map((nature) => (
                      <SelectItem key={nature} value={nature}>
                        {nature}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User Type */}
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>User Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["INDIVIDUAL", "ORGANIZATION"] as const).map((ut) => (
                      <SelectItem key={ut} value={ut}>
                        {ut}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Mobile Toggle for Advanced Details */}
        <div className="block md:hidden">
          <Button
            variant="outline"
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
          >
            {showAdvanced ? "Hide Advanced Details" : "Show Advanced Details"}
          </Button>
        </div>

        {/* Advanced Details Section */}
        <section
          className={`${showAdvanced ? "block" : "hidden"} md:block grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6`}
        >
          {/* Transaction ID (if payment type is not CASH) */}
          {paymentType !== "CASH" && (
            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Transaction ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter transaction ID" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Screenshot Upload */}
          <FormField
            control={form.control}
            name="screenshot"
            render={({ field: { onChange, ...field } }) => (
              <FormItem className="w-full md:col-span-2">
                <FormLabel>Transaction Screenshot</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="screenshot-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Supported formats: JPG, PNG, JPEG, WEBP (Max 5MB)
                          </p>
                        </div>
                        <input
                          id="screenshot-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {previewUrl && (
                      <div className="relative w-full max-w-md mx-auto">
                        <div className="relative group">
                          <img
                            src={previewUrl}
                            alt="Transaction Screenshot"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-90 hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 text-center">
                          {selectedFile?.name}
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>Upload transaction screenshot (Max 5MB)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Entry By */}
          <FormField
            control={form.control}
            name="entryBy"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Entry By</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Make Default Entry Checkbox */}
          <FormField
            control={form.control}
            name="makeDefaultEntry"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center gap-3 p-4 border rounded-md">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="mb-0">Make Default Entry Name</FormLabel>
                    <FormDescription className="text-xs">Save this name for future entries</FormDescription>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter transaction description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["PENDING", "REJECTED", "VERIFIED"] as const).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Money For */}
          <FormField
            control={form.control}
            name="moneyFor"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Money For</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(MoneyForCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Custom Money For (conditional) */}
          {moneyFor === "OTHER" && (
            <FormField
              control={form.control}
              name="customMoneyFor"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Specify Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter custom category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </section>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding Transaction..." : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
}
