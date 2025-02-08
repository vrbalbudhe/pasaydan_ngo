import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriveEntryForm from "@/components/Admin/a_EnterData/DriveEntryForm";
import DonationRequestForm from "@/components/Admin/a_EnterData/DonationRequestForm";
import CertificateEntryForm from "@/components/Admin/a_EnterData/CertificateEntryForm";
import TransactionEntryForm from "@/components/Admin/a_EnterData/TransactionEntryForm";
import { PenLine } from "lucide-react";

export default function EnterDataPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-6 p-4 md:p-8 flex">
      <div className="w-full h-20 flex justify-between items-center px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded-lg">
            <PenLine className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-medium md:font-bold text-gray-900">
              Enter Data
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and enter various types of data for the NGO
            </p>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="drive"
        className="space-y-3 md:space-y-4 w-full h-full"
      >
        <TabsList className="w-full min-h-fit md:p-5 p-10 flex flex-wrap justify-center md:justify-start items-center bg-transparent gap-5 md:gap-2">
          <TabsTrigger
            value="drive"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Drive Entry
          </TabsTrigger>
          <TabsTrigger
            value="donation"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Donation Request
          </TabsTrigger>
          <TabsTrigger
            value="certificate"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Certificate
          </TabsTrigger>
          <TabsTrigger
            value="transaction"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Transaction Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drive" className="space-y-4">
          <DriveEntryForm />
        </TabsContent>

        <TabsContent value="donation" className="space-y-4">
          <DonationRequestForm />
        </TabsContent>

        <TabsContent value="certificate" className="space-y-4">
          <CertificateEntryForm />
        </TabsContent>

        <TabsContent value="transaction" className="space-y-4">
          <TransactionEntryForm />
        </TabsContent>

        <TabsContent value="subadmin" className="space-y-4">
          <div>SubAdmin Entry Form Coming Soon</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}