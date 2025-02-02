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
import { formatCurrency } from "@/utils/format"; // Assuming you have a formatCurrency function
import { toast } from "sonner";

interface TransactionUpdateFormProps {
  transaction: Transaction | null;
  onUpdate: (updatedTransaction: Transaction) => void;
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
  screenshotPath?: string;
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
  organizationId?: string;
}

const TransactionUpdateForm = ({
  transaction,
  onUpdate,
  onCancel,
}: TransactionUpdateFormProps) => {
  const [formData, setFormData] = useState<Transaction | null>(null);

  useEffect(() => {
    if (transaction) {
      setFormData({ ...transaction });
    }
  }, [transaction]);

  if (!formData) return null; // Don't render form if no transaction data

  const handleInputChange = (key: keyof Transaction, value: any) => {
    setFormData((prevData) => {
      if (prevData === null) {
        return { [key]: value } as Transaction;
      }
      return {
        ...prevData,
        [key]: value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onUpdate(formData);
      toast.success("Transaction updated successfully!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md"
    >
      {/* Name */}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter the name"
        />
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={formData.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter the email"
        />
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          placeholder="Enter the phone number"
        />
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          value={formData.amount ? formatCurrency(formData.amount) : ""}
          onChange={(e) =>
            handleInputChange(
              "amount",
              parseFloat(e.target.value.replace(/[^0-9.-]+/g, ""))
            )
          }
          placeholder="Enter the amount"
        />
      </div>

      {/* Transaction ID */}
      <div>
        <Label htmlFor="transactionId">Transaction ID</Label>
        <Input
          id="transactionId"
          value={formData.transactionId || ""}
          onChange={(e) => handleInputChange("transactionId", e.target.value)}
          placeholder="Enter the transaction ID"
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

      {/* Type */}
      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: TransactionType) =>
            handleInputChange("type", value)
          }
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

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter the description"
        />
      </div>

      {/* Entry Type */}
      <div>
        <Label htmlFor="entryType">Entry Type</Label>
        <Select
          value={formData.entryType}
          onValueChange={(value: EntryType) =>
            handleInputChange("entryType", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select entry type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DEBIT">Debit</SelectItem>
            <SelectItem value="CREDIT">Credit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Entry By */}
      <div>
        <Label htmlFor="entryBy">Entry By</Label>
        <Input
          id="entryBy"
          value={formData.entryBy || ""}
          onChange={(e) => handleInputChange("entryBy", e.target.value)}
          placeholder="Enter the entry by"
        />
      </div>

      {/* Verified By */}
      <div>
        <Label htmlFor="verifiedBy">Verified By</Label>
        <Input
          id="verifiedBy"
          value={formData.verifiedBy || ""}
          onChange={(e) => handleInputChange("verifiedBy", e.target.value)}
          placeholder="Enter the verified by"
        />
      </div>

      {/* Screenshot Path */}
      <div>
        <Label htmlFor="screenshotPath">Screenshot Path</Label>
        <Input
          id="screenshotPath"
          value={formData.screenshotPath || ""}
          onChange={(e) => handleInputChange("screenshotPath", e.target.value)}
          placeholder="Enter the screenshot path"
        />
      </div>

      {/* Date */}
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="datetime-local"
          value={
            formData.date instanceof Date
              ? formData.date.toISOString().slice(0, 16)
              : ""
          }
          onChange={(e) => handleInputChange("date", new Date(e.target.value))}
        />
      </div>

      {/* Money For */}
      <div>
        <Label htmlFor="moneyFor">Money For</Label>
        <Select
          value={formData.moneyFor}
          onValueChange={(value: MoneyForCategory) =>
            handleInputChange("moneyFor", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select money for category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SALARY">Salary</SelectItem>
            <SelectItem value="BONUS">Bonus</SelectItem>
            <SelectItem value="FEES">Fees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Money For */}
      <div>
        <Label htmlFor="customMoneyFor">Custom Money For</Label>
        <Input
          id="customMoneyFor"
          value={formData.customMoneyFor || ""}
          onChange={(e) => handleInputChange("customMoneyFor", e.target.value)}
          placeholder="Enter the custom money for"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          Update
        </Button>
      </div>
    </form>
  );
};

export default TransactionUpdateForm;
