"use client";

import dynamic from "next/dynamic";
import { Award } from "lucide-react";

// Dynamically import the components with SSR disabled
const CertificateGenerationForm = dynamic(
  () => import("@/components/Admin/a_Certifications/CertificateGenerationForm"),
  { ssr: false }
);

const UsersCertificateDetails = dynamic(
  () => import("@/components/Admin/a_Certifications/UsersCertificateDetails"),
  { ssr: false }
);

export default function Certificates() {
  return (
    <div className="w-full h-full md:p-4">
      <div className="w-full h-20 flex justify-between items-center px-4 pl-8 pt-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded-lg">
            <Award className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-medium md:font-bold text-gray-900">
              Certificates
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Generate and manage certificates
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-center gap-5">
        <CertificateGenerationForm />
        <UsersCertificateDetails />
      </div>
    </div>
  );
}