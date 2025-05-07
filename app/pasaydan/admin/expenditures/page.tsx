// app/pasaydan/admin/expenditures/page.tsx - Enhanced version with toggle cards
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenditureForm from "@/components/Admin/a_Expenditures/ExpenditureForm";
import ExpenditureTable from "@/components/Admin/a_Expenditures/ExpenditureTable";
import ExpenditureReports from "@/components/Admin/a_Expenditures/ExpenditureReports";
import { ExpenditureProvider } from "@/contexts/ExpenditureContext";
import { IndianRupee, BarChart3, PlusCircle, CoinsIcon } from "lucide-react";

export default function ExpendituresPage() {
  const [activeTab, setActiveTab] = useState("manage");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenditureAdded = () => {
    // Trigger a refresh of the expenditure table when a new expenditure is added
    setRefreshTrigger(prev => prev + 1);
    // Switch to the manage tab to show the updated list
    setActiveTab("manage");
  };

  return (
    <ExpenditureProvider>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-black p-3 rounded-lg shadow-lg">
            <IndianRupee className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Expenditure Management</h1>
        </div>
        
        {/* Toggle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            className={`bg-white p-5 rounded-lg shadow-sm flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-md ${activeTab === "manage" ? "border-2 border-blue-500 shadow-md" : "border border-gray-200"}`}
            onClick={() => setActiveTab("manage")}
          >
            <div className={`${activeTab === "manage" ? "bg-blue-500" : "bg-blue-100"} p-3 rounded-full mb-3 transition-colors duration-300`}>
              <IndianRupee className={`h-6 w-6 ${activeTab === "manage" ? "text-white" : "text-blue-600"}`} />
            </div>
            <h3 className="text-lg font-semibold text-center">Manage Expenditures</h3>
            <p className="text-gray-500 text-center text-sm mt-1">View and manage all recorded expenses</p>
          </div>
          
          <div 
            className={`bg-white p-5 rounded-lg shadow-sm flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-md ${activeTab === "add" ? "border-2 border-green-500 shadow-md" : "border border-gray-200"}`}
            onClick={() => setActiveTab("add")}
          >
            <div className={`${activeTab === "add" ? "bg-green-500" : "bg-green-100"} p-3 rounded-full mb-3 transition-colors duration-300`}>
              <PlusCircle className={`h-6 w-6 ${activeTab === "add" ? "text-white" : "text-green-600"}`} />
            </div>
            <h3 className="text-lg font-semibold text-center">Add New Expenditure</h3>
            <p className="text-gray-500 text-center text-sm mt-1">Record a new expense in the system</p>
          </div>
          
          <div 
            className={`bg-white p-5 rounded-lg shadow-sm flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-md ${activeTab === "reports" ? "border-2 border-purple-500 shadow-md" : "border border-gray-200"}`}
            onClick={() => setActiveTab("reports")}
          >
            <div className={`${activeTab === "reports" ? "bg-purple-500" : "bg-purple-100"} p-3 rounded-full mb-3 transition-colors duration-300`}>
              <BarChart3 className={`h-6 w-6 ${activeTab === "reports" ? "text-white" : "text-purple-600"}`} />
            </div>
            <h3 className="text-lg font-semibold text-center">Reports & Analysis</h3>
            <p className="text-gray-500 text-center text-sm mt-1">View detailed reports and analytics</p>
          </div>
        </div>
        
        <Card className="shadow-md mb-8 overflow-hidden border-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="manage" className="m-0 p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">All Expenditures</h2>
                <p className="text-gray-500 text-sm">
                  View and manage all expenditures recorded in the system
                </p>
              </div>
              <ExpenditureTable key={refreshTrigger} />
            </TabsContent>
            
            <TabsContent value="add" className="m-0 p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Add New Expenditure</h2>
                <p className="text-gray-500 text-sm">
                  Enter details for a new expenditure record
                </p>
              </div>
              <ExpenditureForm onSuccess={handleExpenditureAdded} />
            </TabsContent>
            
            <TabsContent value="reports" className="m-0 p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Expenditure Reports</h2>
                <p className="text-gray-500 text-sm">
                  View detailed reports and analysis of expenditures
                </p>
              </div>
              <ExpenditureReports />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </ExpenditureProvider>
  );
}