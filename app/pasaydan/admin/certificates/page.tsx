import CertificateGenerationForm from "@/components/Admin/a_Certifications/CertificateGenerationForm";
import UsersCertificateDetails from "@/components/Admin/a_Certifications/UsersCertificateDetails";

export default function Certificates() {
  return (
    <div className="w-full h-full md:p-4 pr-2 pl-1 flex flex-col gap-5">
      <CertificateGenerationForm />
      <UsersCertificateDetails />
    </div>
  );
}
