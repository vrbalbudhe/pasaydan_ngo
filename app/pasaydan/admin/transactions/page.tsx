// app/pasaydan/admin/transactions/page.tsx
import { Metadata } from "next";
import TransactionForm from "@/components/Admin/a_transactions/TransactionForm";
import TransactionTable from "@/components/Admin/a_transactions/TransactionTable";
// import TransactionFilters from "@/components/Admin/a_transactions/TransactionFilters";
// import { TransactionStats } from "@/components/Admin/a_transactions/TransactionStats";
// import { ExportButton } from "@/components/Admin/a_transactions/ExportButton";

export const metadata: Metadata = {
  title: "Transactions | Admin Dashboard",
  description: "Transaction management for NGO administrators",
};

export default function TransactionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <div className="flex items-center gap-3">
          {/* Will implement export functionality later
          <ExportButton /> 
          */}
        </div>
      </div>

      {/* Stats Cards - Will implement later
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TransactionStats />
      </div>
      */}

      {/* Main Content */}
      <div className="grid gap-6">
        {/* Transaction Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Transaction</h2>
          <TransactionForm />
        </div>

        {/* Transaction Table Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Transaction Records</h2>
              
              {/* Will implement filters later
              <div className="flex items-center gap-4">
                <TransactionFilters />
              </div>
              */}
            </div>
          </div>
          
          <TransactionTable />
        </div>
      </div>

      {/* Transaction Details Modal - Will implement later
      <TransactionDetailsModal />
      */}
    </div>
  );
}