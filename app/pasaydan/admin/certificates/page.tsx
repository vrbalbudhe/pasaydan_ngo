import CertificateGenerationForm from "@/components/Admin/a_Certifications/CertificateGenerationForm";
import UsersCertificateDetails from "@/components/Admin/a_Certifications/UsersCertificateDetails";

export default function Certificates() {
  return (
    <div className="w-full h-full p-4 flex flex-col gap-5">
      <CertificateGenerationForm />
      <UsersCertificateDetails />
    </div>
  );
}
