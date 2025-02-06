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
    </div>
  );
};

export default SignInPage;
