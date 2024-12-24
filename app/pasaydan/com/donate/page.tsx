import DonationForm from "@/components/donate/donateForm";

export default function DonatePage() {
  return (
    <div className="w-[100%] flex flex-col justify-start items-center min-h-screen bg-gradient-to-tr from-white via-blue-100 to-white/90">
      <DonationForm />
    </div>
  );
}
