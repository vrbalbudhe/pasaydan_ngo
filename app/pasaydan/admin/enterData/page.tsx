// app/pasaydan/admin/enterData/page.tsx

// app/pasaydan/admin/enterData/page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DriveEntryForm from "@/components/Admin/a_EnterData/DriveEntryForm"
import DonationRequestForm from "@/components/Admin/a_EnterData/DonationRequestForm"
import CertificateEntryForm from "@/components/Admin/a_EnterData/CertificateEntryForm"
import TransactionEntryForm from "@/components/Admin/a_EnterData/TransactionEntryForm"

export default function EnterDataPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enter Data</h2>
          <p className="text-muted-foreground">
            Manage and enter various types of data for the NGO
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="drive" className="space-y-4">
        <TabsList className="bg-background h-12">
        <TabsTrigger value="drive" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Drive Entry
          </TabsTrigger>
          <TabsTrigger value="donation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Donation Request
          </TabsTrigger>
          <TabsTrigger value="certificate" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Certificate
          </TabsTrigger>
          <TabsTrigger value="transaction" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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
          {/* CertificateEntryForm component will go here */}
          <CertificateEntryForm/>
        </TabsContent>

        <TabsContent value="transaction" className="space-y-4">
          <TransactionEntryForm />
        </TabsContent>
        
        <TabsContent value="subadmin" className="space-y-4">
          {/* SubAdminEntryForm component will go here */}
          <div>SubAdmin Entry Form Coming Soon</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/*
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DriveEntryForm from "@/components/Admin/a_EnterData/DriveEntryForm"
import OrganizationEntryForm from "@/components/Admin/a_EnterData/OrganizationEntryForm"
import UserEntryForm from "@/components/Admin/a_EnterData/UserEntryForm"
import DonationRequestForm from "@/components/Admin/a_EnterData/DonationRequestForm"
import CertificateEntryForm from "@/components/Admin/a_EnterData/CertificateEntryForm"
import SubAdminEntryForm from "@/components/Admin/a_EnterData/SubAdminEntryForm"

export default function EnterDataPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enter Data</h2>
          <p className="text-muted-foreground">
            Manage and enter various types of data for the NGO
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="drive" className="space-y-4">
        <TabsList className="bg-background h-12">
          <TabsTrigger value="drive" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Drive Entry
          </TabsTrigger>
          <TabsTrigger value="organization" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Organization
          </TabsTrigger>
          <TabsTrigger value="user" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            User
          </TabsTrigger>
          <TabsTrigger value="donation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Donation Request
          </TabsTrigger>
          <TabsTrigger value="certificate" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Certificate
          </TabsTrigger>
          <TabsTrigger value="subadmin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            SubAdmin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drive" className="space-y-4">
          <DriveEntryForm />
        </TabsContent>
        
        <TabsContent value="organization" className="space-y-4">
          <OrganizationEntryForm />
        </TabsContent>
        
        <TabsContent value="user" className="space-y-4">
          <UserEntryForm />
        </TabsContent>
        
        <TabsContent value="donation" className="space-y-4">
          <DonationRequestForm />
        </TabsContent>
        
        <TabsContent value="certificate" className="space-y-4">
          <CertificateEntryForm />
        </TabsContent>
        
        <TabsContent value="subadmin" className="space-y-4">
          <SubAdminEntryForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
*/