import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TransactionStatus,
  TransactionType,
  EntryType,
  TransactionNature,
  MoneyForCategory,
  UserType,
} from "@prisma/client";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";

interface TransactionUpdateFormProps {
  transaction: Transaction | null;
  onUpdate: (updatedTransaction: Transaction) => void;
  onCancel: () => void;
  isOpen: boolean;
}

interface Transaction {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  amount: number;
  type: TransactionType;
  transactionId: string;
  date: Date;
  transactionNature: TransactionNature;
  screenshotPath?: string | null;
  entryType: EntryType;
  entryBy: string;
  entryAt: Date;
  description?: string;
  status: TransactionStatus;
  statusDescription?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  moneyFor: MoneyForCategory;
  customMoneyFor?: string;
  userId?: string;
  organizationId?: string | null;
}

const TransactionUpdateForm = ({
  transaction,
  onUpdate,
  onCancel,
  isOpen,
}: TransactionUpdateFormProps) => {
  const [formData, setFormData] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Transaction, string>>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({ ...transaction });
    }
  }, [transaction]);

  if (!formData || !isOpen) return null;
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Transaction, string>> = {};
    
    // Required fields validation
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Valid amount is required";
    if (!formData.transactionId?.trim()) newErrors.transactionId = "Transaction ID is required";
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key: keyof Transaction, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: value };
    });
    // Clear error when field is edited
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
  
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/transactions/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date instanceof Date ? formData.date.toISOString() : formData.date,
          entryAt: formData.entryAt instanceof Date ? formData.entryAt.toISOString() : formData.entryAt,
          verifiedAt: formData.verifiedAt instanceof Date ? formData.verifiedAt.toISOString() : formData.verifiedAt,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to update transaction");
      }
  
      if (result.success) {
        toast.success("Transaction updated successfully");
        onUpdate(result.data);
        onCancel(); // Close the form after successful update
      } else {
        throw new Error(result.error || "Failed to update transaction");
      }
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      toast.error(error.message || "Failed to update transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-md max-h-[90vh] overflow-y-auto w-full max-w-4xl m-4">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter name"
            disabled={isSubmitting}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter email"
            disabled={isSubmitting}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter phone number"
            disabled={isSubmitting}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* User Type */}
        <div>
          <Label htmlFor="userType">User Type</Label>
          <Select
            value={formData.userType}
            onValueChange={(value: UserType) => handleInputChange("userType", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INDIVIDUAL">Individual</SelectItem>
              <SelectItem value="ORGANIZATION">Organization</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            value={formData.amount ? formatCurrency(formData.amount) : ""}
            onChange={(e) => {
              const value = parseFloat(e.target.value.replace(/[^0-9.-]+/g, ""));
              handleInputChange("amount", value);
            }}
            placeholder="Enter amount"
            disabled={isSubmitting}
            className={errors.amount ? "border-red-500" : ""}
          />
          {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
        </div>

        {/* Transaction Type */}
        <div>
          <Label htmlFor="type">Transaction Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: TransactionType) => handleInputChange("type", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="NET_BANKING">Net Banking</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="CASH">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Nature */}
        <div>
          <Label htmlFor="transactionNature">Transaction Nature</Label>
          <Select
            value={formData.transactionNature}
            onValueChange={(value: TransactionNature) => 
              handleInputChange("transactionNature", value)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select nature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DONATION">Donation</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="REFUND">Refund</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction ID */}
        <div>
          <Label htmlFor="transactionId">Transaction ID</Label>
          <Input
            id="transactionId"
            value={formData.transactionId || ""}
            onChange={(e) => handleInputChange("transactionId", e.target.value)}
            placeholder="Enter transaction ID"
            disabled={isSubmitting || formData.type === "CASH"}
            className={errors.transactionId ? "border-red-500" : ""}
          />
          {errors.transactionId && (
            <p className="text-sm text-red-500 mt-1">{errors.transactionId}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <Label htmlFor="date">Transaction Date</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date instanceof Date ? formData.date.toISOString().slice(0, 16) : ""}
            onChange={(e) => handleInputChange("date", new Date(e.target.value))}
            disabled={isSubmitting}
          />
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: TransactionStatus) => 
              handleInputChange("status", value)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Money For Category */}
        <div>
          <Label htmlFor="moneyFor">Money For</Label>
          <Select
            value={formData.moneyFor}
            onValueChange={(value: MoneyForCategory) => 
              handleInputChange("moneyFor", value)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SALARY">Salary</SelectItem>
              <SelectItem value="BONUS">Bonus</SelectItem>
              <SelectItem value="FEES">Fees</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Money For (shown only when MoneyFor is OTHER) */}
        {formData.moneyFor === "OTHER" && (
          <div>
            <Label htmlFor="customMoneyFor">Specify Other Category</Label>
            <Input
              id="customMoneyFor"
              value={formData.customMoneyFor || ""}
              onChange={(e) => handleInputChange("customMoneyFor", e.target.value)}
              placeholder="Specify category"
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter description"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Entry Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Entry By */}
        <div>
          <Label htmlFor="entryBy">Entry By</Label>
          <Input
            id="entryBy"
            value={formData.entryBy || ""}
            onChange={(e) => handleInputChange("entryBy", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Verified By */}
        <div>
          <Label htmlFor="verifiedBy">Verified By</Label>
          <Input
            id="verifiedBy"
            value={formData.verifiedBy || ""}
            onChange={(e) => handleInputChange("verifiedBy", e.target.value)}
            disabled={isSubmitting || formData.status !== "VERIFIED"}
          />
        </div>
      </div>

     {/* Form Actions */}
     <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isSubmitting ? "Updating..." : "Update Transaction"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionUpdateForm;