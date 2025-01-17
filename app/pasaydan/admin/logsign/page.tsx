import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AdminSignInForm from "@/components/Admin/a_LogSign/signinForm";
import SubAdminsTable from "@/components/Admin/a_LogSign/fecthSubAdmins";

const SignInPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-start p-5">
      <SubAdminsTable />
      {/* <Card className="w-full shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Admin Portal</CardTitle>
          <CardDescription className="text-gray-500">
            Sign in to access your admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4">
            <AdminSignInForm />
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default SignInPage;
