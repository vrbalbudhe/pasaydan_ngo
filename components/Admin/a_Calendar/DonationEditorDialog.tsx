import React, { useState } from "react";
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
  userName,
  dateDisplay,
}: any) => {
  const [manualName, setManualName] = useState(donation.name || "");
  const [selectedUserId, setSelectedUserId] = useState(donation.userId || "");

  const handleSave = () => {
    const updatedDonation = {
      ...donation,
      userId: selectedUserId || null,
      name: selectedUserId ? null : manualName || "Unknown User",
    };
    setDonation(updatedDonation);
    saveDonation();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{donation?.id ? "Edit Donation" : "New Donation"}</DialogTitle>
          <DialogDescription>
            {dateDisplay}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
  <label className="text-sm font-medium">Select User (optional)</label>
  <Select
    value={selectedUserId || "manual"}
    onValueChange={(value) => {
      if (value === "manual") {
        setSelectedUserId("");
      } else {
        setSelectedUserId(value);
        setManualName("");
      }
    }}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select user..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="manual">-- Enter Name Manually --</SelectItem>
      {users.map((user: any) => (
        <SelectItem key={user.id} value={user.id}>
          {user.fullname}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


            <div className="space-y-2">
              <label className="text-sm font-medium">Or Enter Name</label>
              <Input
                placeholder="Enter name manually"
                value={manualName}
                onChange={(e) => {
                  setManualName(e.target.value);
                  setSelectedUserId(""); // Clear selected user when typing manually
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={donation.amount}
                onChange={(e) =>
                  setDonation({
                    ...donation,
                    amount: parseFloat(e.target.value),
                  })
                }
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
          <Button onClick={handleSave} disabled={isSaving}>
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
