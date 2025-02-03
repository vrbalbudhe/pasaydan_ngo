"use client";

import dynamic from "next/dynamic";

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
    <div className="w-full h-full md:p-4 pr-2 pl-1 flex flex-col gap-5">
      <CertificateGenerationForm />
      <UsersCertificateDetails />
    </div>
  );
}
