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
import { TransactionType, TransactionNature, UserType, TransactionStatus, MoneyForCategory } from "@prisma/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// --- Zod Schema ---
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  amount: z.number().min(1, "Amount is required"),
  type: z.enum(["UPI", "NET_BANKING", "CARD", "CASH"]),
  transactionNature: z.enum(["CREDIT", "DEBIT"]),
  userType: z.enum(["INDIVIDUAL", "ORGANIZATION"]),
  date: z.string(),
  transactionId: z.string().optional(),
  screenshot: z
    .any()
    .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE), {
      message: "Max file size is 5MB",
    })
    .refine(
      (file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported",
      }
    )
    .optional(),
  entryBy: z.string().min(2, "Entry by must be at least 2 characters"),
  makeDefaultEntry: z.boolean().default(false),
  description: z.string().optional(),
  status: z.enum(["PENDING", "REJECTED", "VERIFIED"]).default("PENDING"),
  moneyFor: z.enum(["CLOTHES", "FOOD", "CYCLE", "EDUCATION", "HEALTHCARE", "OTHER"]),
  customMoneyFor: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function TransactionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  // Watch for changes in makeDefaultEntry and entryBy
  const makeDefaultEntry = form.watch("makeDefaultEntry");
  const entryBy = form.watch("entryBy");
  const moneyFor = form.watch("moneyFor");
  const type = form.watch("type");

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
    }
  };

  async function onSubmit(data: FormData) {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "screenshot" && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Append file if exists
      if (selectedFile) {
        formData.append("screenshot", selectedFile);
      }

      const response = await fetch("/api/admin/transactions", {
        method: "POST",
        body: formData,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
              <FormItem>
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
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
              <FormItem>
                <FormLabel>Payment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TransactionType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ")}
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
              <FormItem>
                <FormLabel>Nature</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nature" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TransactionNature).map((nature) => (
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
              <FormItem>
                <FormLabel>User Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(UserType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transaction ID (conditional) */}
          {type !== "CASH" && (
            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter transaction ID"
                      {...field}
                      required={type !== "CASH"}
                    />
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
              <FormItem>
                <FormLabel>Transaction Screenshot</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </FormControl>
                <FormDescription>
                  Upload transaction screenshot (Max 5MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Entry By */}
          <FormField
            control={form.control}
            name="entryBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry By</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your name" 
                    {...field} 
                    disabled={defaultEntryName !== "" && makeDefaultEntry}
                  />
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Make Default Entry Name</FormLabel>
                  <FormDescription>
                    Save this name for future entries
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter transaction description"
                    {...field}
                  />
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
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TransactionStatus).map((status) => (
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
              <FormItem>
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
                <FormItem>
                  <FormLabel>Specify Category</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter custom category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding Transaction..." : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
}