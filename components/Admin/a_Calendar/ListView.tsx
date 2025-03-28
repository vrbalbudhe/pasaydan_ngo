import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface ListViewProps {
    users: any[];
    donations: any[];
    monthNames: string[];
    currentMonth: number;
    currentYear: number;
    days: number[];
    openDonationEditor: (userId: string, day: number) => void;
    setSelectedUser: (userId: string | null) => void;
    getUserName: (userId: string) => string;
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
    getUserName,
}) => {
    const handleNewDonation = () => {
        setSelectedUser(null);
        openDonationEditor("", 1);
    };

    return (
        <Card className="bg-white shadow-md overflow-hidden">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <div className="flex items-center space-x-4">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            Donation Entries: {monthNames[currentMonth]} {currentYear}
                        </h2>
                    </div>
                    <Button 
                        onClick={handleNewDonation} 
                        className="flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>New Donation</span>
                    </Button>
                </div>

                <div className="bg-white rounded-lg border overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {["Date", "Member", "Amount", "Type", "Description", "Actions"].map((header, index) => (
                                    <th 
                                        key={header} 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
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
                                    .map((donation, index) => {
                                        const day = parseInt(donation.date.split("-")[2]);
                                        return (
                                            <motion.tr 
                                                key={donation.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ 
                                                    delay: index * 0.05,
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 20
                                                }}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {format(new Date(donation.date), "d MMM yyyy")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {donation.userName || "Unknown User"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {formatCurrency(donation.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`
                                                        px-3 py-1 
                                                        inline-flex 
                                                        text-xs 
                                                        leading-5 
                                                        font-semibold 
                                                        rounded-full 
                                                        ${
                                                            donation.transactionNature === "CREDIT"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }
                                                    `}>
                                                        {donation.transactionNature}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {donation.description || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-500 hover:text-blue-600"
                                                        onClick={() => openDonationEditor(donation.userId, day)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </motion.tr>
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