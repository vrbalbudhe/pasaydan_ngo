import FetchAllDonationRequests from "@/components/Admin/a_DonationRequests/fetchAllDonationRequests";

export default function DonationRequest() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="w-full h-20 flex justify-between mt-10 items-center border-b pb-4">
        <h1 className="tracking-tight text-slate-800 text-2xl font-bold">
          Manage Donation Requests
        </h1>
      </div>
      <div className="mt-6 justify-start items-start flex-wrap flex gap-2 w-full">
        <FetchAllDonationRequests />
      </div>
    </div>
  );
}
