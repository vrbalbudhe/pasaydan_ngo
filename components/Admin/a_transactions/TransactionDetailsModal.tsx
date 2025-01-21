// components/Admin/a_transactions/TransactionDetailsModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/format";
import { Transaction } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <div className="flex flex-row justify-between py-2">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export function TransactionDetailsModal({ 
  isOpen, 
  onClose, 
  transaction 
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      VERIFIED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Basic Information</h3>
            <DetailRow label="Name" value={transaction.name} />
            <DetailRow label="Email" value={transaction.email} />
            <DetailRow label="Phone" value={transaction.phone} />
            <DetailRow 
              label="Amount" 
              value={
                <span className={transaction.transactionNature === 'CREDIT' ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(transaction.amount)}
                </span>
              }
            />
            <DetailRow label="Date" value={formatDate(transaction.date)} />
          </div>

          <Separator />

          {/* Transaction Details */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Transaction Details</h3>
            <DetailRow 
              label="Transaction Type" 
              value={transaction.type.replace('_', ' ')} 
            />
            <DetailRow 
              label="Nature" 
              value={
                <Badge variant={transaction.transactionNature === 'CREDIT' ? 'success' : 'destructive'}>
                  {transaction.transactionNature}
                </Badge>
              }
            />
            {transaction.type !== 'CASH' && (
              <DetailRow label="Transaction ID" value={transaction.transactionId} />
            )}
            <DetailRow label="User Type" value={transaction.userType} />
            <DetailRow 
              label="Status" 
              value={
                <Badge className={getStatusBadge(transaction.status)}>
                  {transaction.status}
                </Badge>
              }
            />
          </div>

          <Separator />

          {/* Additional Information */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Additional Information</h3>
            <DetailRow label="Money For" value={transaction.moneyFor} />
            {transaction.customMoneyFor && (
              <DetailRow label="Custom Category" value={transaction.customMoneyFor} />
            )}
            <DetailRow label="Entry Type" value={transaction.entryType} />
            <DetailRow label="Entry By" value={transaction.entryBy} />
            <DetailRow 
              label="Entry At" 
              value={formatDate(transaction.entryAt)}
            />
            {transaction.description && (
              <DetailRow label="Description" value={transaction.description} />
            )}
          </div>

          {/* Verification Information - Show only if verified or rejected */}
          {(transaction.status === 'VERIFIED' || transaction.status === 'REJECTED') && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-2">Verification Details</h3>
                {transaction.verifiedBy && (
                  <DetailRow label="Verified By" value={transaction.verifiedBy} />
                )}
                {transaction.verifiedAt && (
                  <DetailRow 
                    label="Verified At" 
                    value={formatDate(transaction.verifiedAt)} 
                  />
                )}
                {transaction.statusDescription && (
                  <DetailRow 
                    label="Status Note" 
                    value={transaction.statusDescription} 
                  />
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}