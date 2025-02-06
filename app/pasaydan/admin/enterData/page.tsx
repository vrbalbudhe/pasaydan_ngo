import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriveEntryForm from "@/components/Admin/a_EnterData/DriveEntryForm";
import DonationRequestForm from "@/components/Admin/a_EnterData/DonationRequestForm";
import CertificateEntryForm from "@/components/Admin/a_EnterData/CertificateEntryForm";
import TransactionEntryForm from "@/components/Admin/a_EnterData/TransactionEntryForm";

export default function EnterDataPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-6 md:space-y-8 p-4 md:p-8 flex">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div className="text-wrap">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Enter Data
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage and enter various types of data for the NGO
          </p>
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
