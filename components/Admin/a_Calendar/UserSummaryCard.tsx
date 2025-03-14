import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const UserSummaryCard = ({ user, donations }: any) => {
  const userDonations = donations.filter((d: any) => d.userId === user.id);
  const userTotal = userDonations.reduce((sum: number, donation: any) => {
    return donation.transactionNature === "CREDIT" ? sum + donation.amount : sum - donation.amount;
  }, 0);

  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${userTotal >= 0 ? "bg-green-500" : "bg-red-500"}`} />
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{user.fullname}</h3>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="text-sm text-gray-500">Total: </span>
            <span className={`font-bold ${userTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(userTotal)}
            </span>
          </div>
          <div className="text-sm text-gray-500">{userDonations.length} entries</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSummaryCard;
