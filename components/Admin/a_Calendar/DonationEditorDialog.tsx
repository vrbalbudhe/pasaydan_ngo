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
import { Loader2, Check } from "lucide-react";

const DonationEditorDialog = ({
  open,
  onClose,
  donation,
  setDonation,
  saveDonation,
  isSaving,
  users,
  dateDisplay,
}: any) => {
  const [manualName, setManualName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("manual-entry");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (donation) {
      setManualName(donation.name || donation.userName || "");
      setSelectedUserId(donation.userId || "manual-entry");
      setEmail(donation.email || "");
      setPhone(donation.phone || "");
    }
  }, [donation]);

  const handleSave = () => {
    const userName = selectedUserId === "manual-entry" 
      ? manualName 
      : users.find((u: any) => u.id === selectedUserId)?.fullname || manualName;
    
    // Find user email if a user is selected
    const userEmail = selectedUserId === "manual-entry" 
      ? email
      : users.find((u: any) => u.id === selectedUserId)?.email || email;

    const updatedDonation = {
      ...donation,
      userId: selectedUserId === "manual-entry" ? null : selectedUserId,
      name: userName,
      userName: userName, // Ensure userName is populated for display
      email: userEmail,
      phone: phone
    };
    
    setDonation(updatedDonation);
    saveDonation();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Donation</DialogTitle>
          <DialogDescription>{dateDisplay}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select User</label>
            <Select
              value={selectedUserId}
              onValueChange={(value) => {
                setSelectedUserId(value);
                if (value !== "manual-entry") {
                  // Find the user and populate their information
                  const selectedUser = users.find((u: any) => u.id === value);
                  if (selectedUser) {
                    setManualName("");
                    setEmail(selectedUser.email || "");
                    setPhone(selectedUser.mobile || selectedUser.phone || "");
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual-entry">Manual Entry</SelectItem>
                {users.map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUserId === "manual-entry" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter Name</label>
                <Input
                  placeholder="Enter name manually"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email (Optional)</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone (Optional)</label>
                <Input
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={donation.amount}
                onChange={(e) =>
                  setDonation({
                    ...donation,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction Type</label>
              <Select
                value={donation.transactionNature}
                onValueChange={(value) =>
                  setDonation({ ...donation, transactionNature: value })
                }
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              rows={3}
              value={donation.description}
              onChange={(e) =>
                setDonation({ ...donation, description: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || (selectedUserId === "manual-entry" && !manualName)}
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

export default DonationEditorDialog;