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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Check, Trash, AlertCircle } from "lucide-react";
import { format } from "date-fns";

import { DonationEntry, User } from "@/app/pasaydan/admin/calendar/page";

// Payment Types
const PAYMENT_TYPES = ["CASH", "UPI", "NET_BANKING", "CARD"] as const;
type PaymentType = typeof PAYMENT_TYPES[number];

interface EditDonationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<void>;
  onDelete: (donationId: string) => Promise<void>;
  isSaving: boolean;
  donation: DonationEntry | null;
  users: User[];
}

const EditDonationDialog: React.FC<EditDonationDialogProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  isSaving,
  donation,
  users
}) => {
  const [selectedUserId, setSelectedUserId] = useState("manual-entry");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form state
 // Add userType to formData state
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  amount: 0,
  type: "CASH" as PaymentType,
  transactionNature: "CREDIT",
  description: "",
  transactionId: "",
  userType: "INDIVIDUAL" // Add userType to track
});

// Update the useEffect to include userType from donation
useEffect(() => {
  if (donation) {
    // Find if this donation is from a known user
    const foundUser = users.find(u => u.id === donation.userId);
    
    setFormData({
      name: donation.name || "",
      email: donation.email || "",
      phone: donation.phone || "",
      amount: donation.amount || 0,
      type: (donation.type as PaymentType) || "CASH",
      transactionNature: donation.transactionNature || "CREDIT",
      description: donation.description || "",
      transactionId: donation.transactionId || "",
      userType: donation.userType || "INDIVIDUAL" // Include userType
    });
    
    setSelectedUserId(foundUser ? foundUser.id : "manual-entry");
  }
}, [donation, users]);

// Update handleUserChange to handle userType properly
const handleUserChange = (userId: string) => {
  setSelectedUserId(userId);
  
  if (userId === "manual-entry") {
    // Keep existing data for manual editing
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
        userType: userType // Update userType based on selected user
      });
    }
  }
};

  // Handle saving the donation
  const handleSave = async () => {
    // Call parent save function
    await onSave(formData);
  };

  // Handle deleting the donation
  const handleDelete = async () => {
    if (donation) {
      await onDelete(donation.id);
      setDeleteDialogOpen(false);
    }
  };

  if (!donation) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
            <DialogTitle>Edit Donation</DialogTitle>
            <DialogDescription>
              {donation.date ? format(new Date(donation.date), "MMMM d, yyyy") : ""}
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

            {/* Name Field (always editable) */}
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
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
              
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>

            {/* Amount and Transaction Type */}
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

          <DialogFooter className="sticky bottom-0 bg-white z-10 pt-4 mt-2 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(true)} 
              className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200"
            >
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={
                  isSaving || 
                  !formData.name ||
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
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this donation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditDonationDialog;