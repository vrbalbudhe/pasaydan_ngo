import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { format } from "date-fns";

import { User } from "@/app/pasaydan/admin/calendar/page";

// Payment Types
const PAYMENT_TYPES = ["CASH", "UPI", "NET_BANKING", "CARD"] as const;
type PaymentType = typeof PAYMENT_TYPES[number];

interface AddDonationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<void>;
  isSaving: boolean;
  selectedDate: Date;
  users: User[];
}

const AddDonationDialog: React.FC<AddDonationDialogProps> = ({
  open,
  onClose,
  onSave,
  isSaving,
  selectedDate,
  users
}) => {
  const [selectedUserId, setSelectedUserId] = useState("manual-entry");
  const [makeDefaultEntry, setMakeDefaultEntry] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: 0,
    type: "CASH" as PaymentType,
    transactionNature: "CREDIT",
    description: "",
    entryBy: localStorage.getItem("defaultEntryName") || "",
    userType: "INDIVIDUAL",
    transactionId: "", // Added transactionId field
    moneyFor: "OTHER"
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedUserId("manual-entry");
      setMakeDefaultEntry(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        amount: 0,
        type: "CASH" as PaymentType,
        transactionNature: "CREDIT",
        description: "",
        entryBy: localStorage.getItem("defaultEntryName") || "",
        userType: "INDIVIDUAL",
        transactionId: "",
        moneyFor: "OTHER"
      });
    }
  }, [open]);

  // Handle user selection change
  // Change the handleUserChange function to include proper user type handling
const handleUserChange = (userId: string) => {
  setSelectedUserId(userId);
  
  if (userId === "manual-entry") {
    // Reset to empty form for manual entry
    setFormData({
      ...formData,
      name: "",
      email: "",
      phone: "",
      userType: "INDIVIDUAL" // Default to INDIVIDUAL for manual entry
    });
  } else {
    // Find selected user and populate form
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      // Set the proper userType based on the user's type
      const userType = selectedUser.type?.toUpperCase() || "INDIVIDUAL";
      
      setFormData({
        ...formData,
        name: selectedUser.fullname,
        email: selectedUser.email || "",
        phone: selectedUser.mobile || selectedUser.phone || "",
        userType: userType // Ensure userType is set based on selected user
      });
    }
  }
};

  // Handle saving the donation
  const handleSave = async () => {
    // Save entry name preference if checked
    if (makeDefaultEntry && formData.entryBy) {
      localStorage.setItem("defaultEntryName", formData.entryBy);
    }
    
    // Call parent save function
    await onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
          <DialogTitle>Add New Donation</DialogTitle>
          <DialogDescription>
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select User</label>
            <Select
              value={selectedUserId}
              onValueChange={handleUserChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual-entry">Manual Entry</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Manual Entry Form Fields */}
          {selectedUserId === "manual-entry" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email (Optional)</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone (Optional)</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          )}

          {/* Always visible form fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction Type</label>
              <Select
                value={formData.transactionNature}
                onValueChange={(value) => setFormData({...formData, transactionNature: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREDIT">Credit (Received)</SelectItem>
                  <SelectItem value="DEBIT">Debit (Paid Out)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <Select
              value={formData.type}
              onValueChange={(value: PaymentType) => setFormData({...formData, type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction ID Field - Only show for non-CASH payment types */}
          {formData.type !== "CASH" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Transaction ID</label>
                <div className="text-xs text-amber-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Required for {formData.type.replace("_", " ")} payments
                </div>
              </div>
              <Input
                value={formData.transactionId}
                onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                placeholder={`Enter ${formData.type.replace("_", " ")} Transaction ID`}
                required
              />
            </div>
          )}

          {/* Entry By */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Entry By</label>
            <Input
              value={formData.entryBy}
              onChange={(e) => setFormData({...formData, entryBy: e.target.value})}
              placeholder="Your name"
            />
          </div>

          {/* Make Default option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="make-default"
              checked={makeDefaultEntry}
              onCheckedChange={(checked) => setMakeDefaultEntry(!!checked)}
            />
            <label
              htmlFor="make-default"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember my name for future entries
            </label>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter description"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 bg-white z-10 pt-4 mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={
              isSaving || 
              (selectedUserId === "manual-entry" && !formData.name) || 
              (formData.type !== "CASH" && !formData.transactionId) // Disable if non-cash payment and no transaction ID
            }
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" /> Save
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDonationDialog;