"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

/**
 * Export a type alias for the transaction used in the update form.
 * We force statusDescription to be `string | null` instead of possibly undefined.
 */
export type UpdateTransaction = Omit<Transaction, "statusDescription"> & {
  statusDescription: string | null;
};

interface TransactionUpdateFormProps {
  transaction: UpdateTransaction | null;
  onUpdate: (updatedTransaction: UpdateTransaction) => void;
  onCancel: () => void;
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
  screenshotPath: string | null;
  entryType: EntryType;
  entryBy: string;
  entryAt: Date;
  description: string | null;
  status: TransactionStatus;
  statusDescription?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  moneyFor: MoneyForCategory;
  customMoneyFor?: string;
  userId?: string;
  organizationId: string | null;
}

const TransactionUpdateForm = ({
  transaction,
  onUpdate,
  onCancel,
}: TransactionUpdateFormProps) => {
  const [formData, setFormData] = useState<UpdateTransaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateTransaction, string>>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({ ...transaction });
    }
  }, [transaction]);

  if (!formData) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateTransaction, string>> = {};

    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Valid amount is required";
    if (!formData.transactionId?.trim())
      newErrors.transactionId = "Transaction ID is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key: keyof UpdateTransaction, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: value };
    });
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: formData.date instanceof Date ? formData.date.toISOString() : formData.date,
          entryAt: formData.entryAt instanceof Date ? formData.entryAt.toISOString() : formData.entryAt,
          verifiedAt: formData.verifiedAt instanceof Date ? formData.verifiedAt.toISOString() : formData.verifiedAt,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update transaction");
      }

      if (result.success) {
        toast.success("Transaction updated successfully");
        onUpdate(result.data);
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div>
          <Label htmlFor="transactionNature">Transaction Nature</Label>
          <Select
            value={formData.transactionNature}
            onValueChange={(value: TransactionNature) => handleInputChange("transactionNature", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select nature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CREDIT">Credit</SelectItem>
              <SelectItem value="DEBIT">Debit</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          {errors.transactionId && <p className="text-sm text-red-500 mt-1">{errors.transactionId}</p>}
        </div>
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
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: TransactionStatus) => handleInputChange("status", value)}
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
        <div>
          <Label htmlFor="moneyFor">Money For</Label>
          <Select
            value={formData.moneyFor}
            onValueChange={(value: MoneyForCategory) => handleInputChange("moneyFor", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLOTHES">Clothes</SelectItem>
              <SelectItem value="FOOD">Food</SelectItem>
              <SelectItem value="CYCLE">Cycle</SelectItem>
              <SelectItem value="EDUCATION">Education</SelectItem>
              <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        <div>
          <Label htmlFor="entryBy">Entry By</Label>
          <Input
            id="entryBy"
            value={formData.entryBy || ""}
            onChange={(e) => handleInputChange("entryBy", e.target.value)}
            disabled={isSubmitting}
          />
        </div>
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
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} title="Cancel">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90" title="Update Transaction">
          {isSubmitting ? "Updating..." : "Update Transaction"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionUpdateForm;
