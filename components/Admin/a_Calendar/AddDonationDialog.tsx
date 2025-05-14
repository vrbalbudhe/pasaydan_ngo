import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
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

// Define form data structure with index signature for TypeScript
interface FormData {
  name: string;
  email: string;
  phone: string;
  userType: string;
  amount: number;
  transactionNature: string;
  type: PaymentType;
  transactionId: string;
  description: string;
  entryBy: string;
  moneyFor: string;
  [key: string]: string | number | PaymentType; // Add index signature
}

interface AddDonationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<void>;
  isSaving: boolean;
  selectedDate: Date;
  users: User[];
}

// Memoized SelectItem components
const MemoizedSelectItem = memo(SelectItem);

// Extremely lightweight dropdown component to replace the shadcn UI Select
const LightweightDropdown = memo(({ 
  value, 
  onChange, 
  options, 
  label 
}: { 
  value: string, 
  onChange: (value: string) => void, 
  options: {value: string, label: string}[],
  label: string
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <select
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={value}
        onChange={(e) => {
          // Call onChange handler directly for immediate UI update
          onChange(e.target.value);
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

// Memoized user select component
const UserSelect = memo(({ value, onChange, items }: { 
  value: string, 
  onChange: (value: string) => void, 
  items: React.ReactNode[] 
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">Select User</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select user..." />
      </SelectTrigger>
      <SelectContent>
        {items}
      </SelectContent>
    </Select>
  </div>
));

// The main component
const AddDonationDialog: React.FC<AddDonationDialogProps> = ({
  open,
  onClose,
  onSave,
  isSaving,
  selectedDate,
  users
}) => {
  // Use references to avoid rendering delays - with proper type
  const formDataRef = useRef<FormData>({
    name: "",
    email: "",
    phone: "",
    userType: "INDIVIDUAL",
    amount: 0,
    transactionNature: "CREDIT",
    type: "CASH" as PaymentType,
    transactionId: "",
    description: "",
    entryBy: localStorage.getItem("defaultEntryName") || "",
    moneyFor: "OTHER"
  });

  // UI state for controlled components
  const [selectedUserId, setSelectedUserId] = useState("manual-entry");
  const [nameField, setNameField] = useState("");
  const [emailField, setEmailField] = useState("");
  const [phoneField, setPhoneField] = useState("");
  const [amountField, setAmountField] = useState("0");
  const [transactionNatureField, setTransactionNatureField] = useState("CREDIT");
  const [paymentTypeField, setPaymentTypeField] = useState<string>("CASH");
  const [transactionIdField, setTransactionIdField] = useState("");
  const [descriptionField, setDescriptionField] = useState("");
  const [entryByField, setEntryByField] = useState(localStorage.getItem("defaultEntryName") || "");
  const [makeDefaultEntry, setMakeDefaultEntry] = useState(false);
  const [showTransactionIdField, setShowTransactionIdField] = useState(false);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedUserId("manual-entry");
      setNameField("");
      setEmailField("");
      setPhoneField("");
      setAmountField("0");
      setTransactionNatureField("CREDIT");
      setPaymentTypeField("CASH");
      setTransactionIdField("");
      setDescriptionField("");
      // Keep entry by name
      setMakeDefaultEntry(false);
      setShowTransactionIdField(false);
      
      // Reset ref data as well
      formDataRef.current = {
        ...formDataRef.current,
        name: "",
        email: "",
        phone: "",
        userType: "INDIVIDUAL",
        amount: 0,
        transactionNature: "CREDIT",
        type: "CASH",
        transactionId: "",
        description: "",
        moneyFor: "OTHER"
        // Keep entryBy as is
      };
    }
  }, [open]);

  // When user selection changes
  const handleUserChange = useCallback((userId: string) => {
    setSelectedUserId(userId);
    
    if (userId === "manual-entry") {
      // Clear form fields for manual entry
      setNameField("");
      setEmailField("");
      setPhoneField("");
      formDataRef.current.userType = "INDIVIDUAL";
    } else {
      // Find selected user and populate form
      const selectedUser = users.find(user => user.id === userId);
      if (selectedUser) {
        // Update UI fields
        setNameField(selectedUser.fullname || "");
        setEmailField(selectedUser.email || "");
        setPhoneField(selectedUser.mobile || selectedUser.phone || "");
        
        // Update ref data
        formDataRef.current.userType = selectedUser.type?.toUpperCase() || "INDIVIDUAL";
      }
    }
  }, [users]);

  // Handle transaction nature change
  const handleTransactionNatureChange = useCallback((value: string) => {
    // Update UI state
    setTransactionNatureField(value);
    // Update data ref
    formDataRef.current.transactionNature = value;
  }, []);

  // Handle payment type change
  const handlePaymentTypeChange = useCallback((value: string) => {
    console.log("Payment type changed to:", value);
    
    // Update UI state immediately
    setPaymentTypeField(value);
    
    // Update reference data
    formDataRef.current.type = value as PaymentType;
    
    // Update transaction ID visibility based on selection
    setShowTransactionIdField(value !== "CASH");
  }, []);

  // Update form data ref when fields change - now type-safe with formData interface
  const updateFormDataRef = useCallback((field: keyof FormData, value: string | number | PaymentType) => {
    formDataRef.current[field] = value;
  }, []);

  // Get current form data combining UI state and ref data
  const getFormData = useCallback(() => {
    // Update ref with current UI values first
    formDataRef.current.name = nameField;
    formDataRef.current.email = emailField;
    formDataRef.current.phone = phoneField;
    formDataRef.current.amount = parseFloat(amountField) || 0;
    formDataRef.current.transactionNature = transactionNatureField;
    formDataRef.current.type = paymentTypeField as PaymentType;
    formDataRef.current.transactionId = transactionIdField;
    formDataRef.current.description = descriptionField;
    formDataRef.current.entryBy = entryByField;
    
    // Return the combined data
    return {
      ...formDataRef.current,
      userId: selectedUserId !== "manual-entry" ? selectedUserId : null
    };
  }, [
    nameField, emailField, phoneField, amountField,
    transactionNatureField, paymentTypeField, transactionIdField,
    descriptionField, entryByField, selectedUserId
  ]);

  // Save handler
  const handleSave = useCallback(async () => {
    // Save entry name preference if checked
    if (makeDefaultEntry && entryByField) {
      localStorage.setItem("defaultEntryName", entryByField);
    }
    
    // Get all form data and save
    const formData = getFormData();
    console.log("Saving form data:", formData);
    await onSave(formData);
  }, [makeDefaultEntry, entryByField, getFormData, onSave]);

  // Memoized user items for user select dropdown
  const userItems = useMemo(() => [
    <MemoizedSelectItem key="manual-entry" value="manual-entry">
      Manual Entry
    </MemoizedSelectItem>,
    ...users.map(user => (
      <MemoizedSelectItem key={user.id} value={user.id}>
        {user.fullname}
      </MemoizedSelectItem>
    ))
  ], [users]);

  // Options for payment type dropdown
  const paymentTypeOptions = useMemo(() => [
    { value: "CASH", label: "CASH" },
    { value: "UPI", label: "UPI" },
    { value: "NET_BANKING", label: "NET BANKING" },
    { value: "CARD", label: "CARD" }
  ], []);

  // Transaction nature options
  const transactionNatureOptions = useMemo(() => [
    { value: "CREDIT", label: "Credit (Received)" },
    { value: "DEBIT", label: "Debit (Paid Out)" }
  ], []);

  // Form validation
  const isFormValid = useMemo(() => {
    if (isSaving) return false;
    if (selectedUserId === "manual-entry" && !nameField) return false;
    if (paymentTypeField !== "CASH" && !transactionIdField) return false;
    return true;
  }, [isSaving, selectedUserId, nameField, paymentTypeField, transactionIdField]);

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
          <UserSelect 
            value={selectedUserId} 
            onChange={handleUserChange}
            items={userItems}
          />

          {/* Manual Entry Form Fields */}
          {selectedUserId === "manual-entry" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={nameField}
                  onChange={(e) => {
                    setNameField(e.target.value);
                    updateFormDataRef("name", e.target.value);
                  }}
                  placeholder="Enter name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email (Optional)</label>
                <Input
                  type="email"
                  value={emailField}
                  onChange={(e) => {
                    setEmailField(e.target.value);
                    updateFormDataRef("email", e.target.value);
                  }}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone (Optional)</label>
                <Input
                  value={phoneField}
                  onChange={(e) => {
                    setPhoneField(e.target.value);
                    updateFormDataRef("phone", e.target.value);
                  }}
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
                value={amountField}
                onChange={(e) => {
                  setAmountField(e.target.value);
                  updateFormDataRef("amount", parseFloat(e.target.value) || 0);
                }}
                placeholder="Enter amount"
                required
              />
            </div>

            <LightweightDropdown
              label="Transaction Type"
              value={transactionNatureField}
              onChange={handleTransactionNatureChange}
              options={transactionNatureOptions}
            />
          </div>

          {/* Payment Method - Using lightweight dropdown */}
          <LightweightDropdown
            label="Payment Method"
            value={paymentTypeField}
            onChange={handlePaymentTypeChange}
            options={paymentTypeOptions}
          />

          {/* Transaction ID Field - Only show for non-CASH payment types */}
          {showTransactionIdField && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Transaction ID</label>
                <div className="text-xs text-amber-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Required for {paymentTypeField.replace("_", " ")} payments
                </div>
              </div>
              <Input
                value={transactionIdField}
                onChange={(e) => {
                  setTransactionIdField(e.target.value);
                  updateFormDataRef("transactionId", e.target.value);
                }}
                placeholder={`Enter ${paymentTypeField.replace("_", " ")} Transaction ID`}
                required
              />
            </div>
          )}

          {/* Entry By */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Entry By</label>
            <Input
              value={entryByField}
              onChange={(e) => {
                setEntryByField(e.target.value);
                updateFormDataRef("entryBy", e.target.value);
              }}
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
              value={descriptionField}
              onChange={(e) => {
                setDescriptionField(e.target.value);
                updateFormDataRef("description", e.target.value);
              }}
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
            disabled={!isFormValid}
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

export default memo(AddDonationDialog);