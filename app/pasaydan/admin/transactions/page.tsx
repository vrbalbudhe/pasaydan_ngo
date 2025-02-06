// app/pasaydan/admin/transactions/page.tsx
import { Metadata } from "next";
import TransactionForm from "@/components/Admin/a_transactions/TransactionForm";
import TransactionTable from "@/components/Admin/a_transactions/TransactionTable";
import TransactionFilters from "@/components/Admin/a_transactions/TransactionFilters";
import { TransactionStats } from "@/components/Admin/a_transactions/TransactionStats";
import { ExportButton } from "@/components/Admin/a_transactions/ExportButton";
import { TransactionProvider } from "@/contexts/TransactionContext";

export const metadata: Metadata = {
  title: "Transactions | Admin Dashboard",
  description: "Transaction management for NGO administrators",
};

function TransactionContent() {
  return (
    <TransactionProvider>
      <div className="container mx-auto md:p-6 p-2 space-y-3">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <div className="flex items-center gap-3">
            <ExportButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
