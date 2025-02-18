import DonationForm from "@/components/donate/donateForm";


export default function DonatePage() {
  return (
    <div className="w-[100%] flex flex-col justify-start pb-10 items-center min-h-screen">
      <div className="md:w-[80%] w-full flex flex-col justify-center items-center">
        <DonationForm />
      </div>
    </div>
  );
}
