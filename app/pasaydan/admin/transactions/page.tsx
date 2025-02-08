import { Metadata } from "next";
import TransactionForm from "@/components/Admin/a_transactions/TransactionForm";
import TransactionTable from "@/components/Admin/a_transactions/TransactionTable";
import TransactionFilters from "@/components/Admin/a_transactions/TransactionFilters";
import { TransactionStats } from "@/components/Admin/a_transactions/TransactionStats";
import { ExportButton } from "@/components/Admin/a_transactions/ExportButton";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { IndianRupee } from "lucide-react";

export const metadata: Metadata = {
  title: "Transactions | Admin Dashboard",
  description: "Transaction management for NGO administrators",
};

function TransactionContent() {
  return (
    <TransactionProvider>
      <div className="container mx-auto md:p-6 p-2 space-y-3">
        {/* Header Section */}
        <div className="w-full h-20 flex justify-between items-center px-4 pl-5 pt-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-black p-2 rounded-lg">
              <IndianRupee className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                Transactions
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and track transactions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ExportButton />
          </div>
        </div>

        {/* Stats */}
        <div className="w-full">
          <TransactionStats />
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Transaction Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Transaction</h2>
            <TransactionForm />
          </div>

          {/* Transaction Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
                <h2 className="text-lg font-semibold">Transaction Records</h2>
                <TransactionFilters />
              </div>
            </div>
            <TransactionTable />
          </div>
        </div>
      </div>
    </TransactionProvider>
  );
}

export default function TransactionsPage() {
  return <TransactionContent />;
}