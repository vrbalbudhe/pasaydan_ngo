// components/Admin/a_Expenditures/ExpenditureForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useExpenditures } from "@/contexts/ExpenditureContext";
import { cn } from "@/lib/utils";

// Define form schema
const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  date: z.date({
    required_error: "Please select a date",
  }),
  description: z.string().optional(),
  category: z.enum(["CYCLE", "ASHRAM", "STUDENT", "OTHER"], {
    required_error: "Please select a category",
  }),
  customCategory: z.string().optional(),
  userId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ExpenditureFormProps {
  expenditureId?: string;
  onSuccess?: () => void;
}

export default function ExpenditureForm({ expenditureId, onSuccess }: ExpenditureFormProps) {
  const { toast } = useToast();
  const { addExpenditure, updateExpenditure } = useExpenditures();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<{ id: string; fullname: string; email: string }[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      description: "",
      category: "CYCLE",
      customCategory: "",
      userId: "none",  // Changed from empty string to "none"
    },
  });

  // Fetch users for the dropdown
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          // Handle when users endpoint returns an error
          console.error("Error fetching users:", response.statusText);
          // Set empty array to prevent repeated failed requests
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        // Set empty array to prevent repeated failed requests
        setUsers([]);
      }
    }
  
    fetchUsers();
  }, []);

  // Fetch expenditure details if in edit mode
  useEffect(() => {
    if (expenditureId) {
      setIsEditMode(true);
      setIsLoading(true);
      
      fetch(`/api/admin/expenditures/${expenditureId}`)
        .then(response => {
          if (!response.ok) throw new Error("Failed to fetch expenditure");
          return response.json();
        })
        .then(data => {
          form.reset({
            amount: data.amount,
            date: new Date(data.date),
            description: data.description || "",
            category: data.category,
            customCategory: data.customCategory || "",
            userId: data.userId || "none",  // Changed from empty string to "none"
          });
        })
        .catch(error => {
          console.error("Error:", error);
          toast({
            title: "Error",
            description: "Failed to load expenditure details",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [expenditureId, form, toast]);

  // Watch the category field to show/hide custom category input
  const selectedCategory = form.watch("category");

  // Handle form submission
  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    
    try {
      // Process the userId field
      const processedValues = {
        ...values,
        userId: values.userId === "none" ? null : values.userId,
      };
      
      if (isEditMode && expenditureId) {
        // Update existing expenditure
        const updated = await updateExpenditure(expenditureId, processedValues);
        
        if (updated) {
          toast({
            title: "Success",
            description: "Expenditure updated successfully",
          });
          
          if (onSuccess) onSuccess();
        }
      } else {
        // Add new expenditure
        const added = await addExpenditure(processedValues);
        
        if (added) {
          toast({
            title: "Success",
            description: "Expenditure added successfully",
          });
          
          // Reset form
          form.reset({
            amount: 0,
            date: new Date(),
            description: "",
            category: "CYCLE",
            customCategory: "",
            userId: "none",  // Changed from empty string to "none"
          });
          
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save expenditure",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CYCLE">Cycle</SelectItem>
                    <SelectItem value="ASHRAM">Ashram</SelectItem>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Custom Category Field (Only shown when category is "OTHER") */}
          {selectedCategory === "OTHER" && (
            <FormField
              control={form.control}
              name="customCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* User Field (for associating with a member) */}
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Associated Member (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.fullname || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter details about this expenditure"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? "Update Expenditure" : "Add Expenditure"}
        </Button>
      </form>
    </Form>
  );
}