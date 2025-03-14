import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface ListViewProps {
    users: any[];
    donations: any[];
    monthNames: string[];
    currentMonth: number;
    currentYear: number;
    days: number[];
    openDonationEditor: (userId: string, day: number) => void;
    setSelectedUser: (userId: string | null) => void;
}

const ListView: React.FC<ListViewProps> = ({
    users,
    donations,
    monthNames,
    currentMonth,
    currentYear,
    days,
    openDonationEditor,
    setSelectedUser,
}) => {
    const handleNewDonation = () => {
        setSelectedUser(null);
        openDonationEditor("", 1);
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        Donation Entries: {monthNames[currentMonth]} {currentYear}
                    </h2>
                    <Button onClick={handleNewDonation}>
                        <Plus className="h-4 w-4 mr-2" /> New Donation
                    </Button>
                </div>

                <div className="bg-white rounded-md border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        No donations found for this month.
                                    </td>
                                </tr>
                            ) : (
                                donations
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .map((donation) => {
                                        const day = parseInt(donation.date.split("-")[2]);
                                        return (
                                            <tr key={donation.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {format(new Date(donation.date), "d MMM yyyy")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {donation.userName || "Unknown User"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {formatCurrency(donation.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        donation.transactionNature === "CREDIT"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}>
                                                        {donation.transactionNature}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {donation.description || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => openDonationEditor(donation.userId, day)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default ListView;
