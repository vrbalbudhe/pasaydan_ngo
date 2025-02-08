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
import { Users } from "lucide-react";

const SignInPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-start justify-start">
      <div className="w-full h-20 flex justify-between items-center px-4 pl-11 pt-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">
              Sub Admins
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage sub-admin accounts and permissions
            </p>
          </div>
        </div>
      </div>

      <div className="w-full p-5">
        <SubAdminsTable />
      </div>
    </div>
  );
};

export default SignInPage;