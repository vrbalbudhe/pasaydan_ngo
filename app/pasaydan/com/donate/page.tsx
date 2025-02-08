import DonationForm from "@/components/donate/donateForm";
import GenerateCertificateForm from "@/components/donate/generateCertificateCard";
import { motion } from "framer-motion";

const CommunityPageHeading = () => {
  return (
    <div className="md:w-[90%] w-full pl-2 min-h-[250px] md:flex flex-col justify-center items-center">
      <h1 className="text-center md:text-6xl min-h-10 md:fit text-wrap text-5xl text-slate-800">
        Download
        <span className="ml-2 font-bold block md:inline-block text-[#1a237e]">
          Certificates
        </span>
      </h1>
      <p className="md:w-[80%] w-[100%] text-center text-pretty p-5 -tracking-tight text-slate-700">
        Join us in transforming lives and building a stronger community. Through
        your support and our dedicated efforts, we bring hope, resources, and
        opportunities to those in need. Together, we can create a brighter
        future for everyone. Witness the power of unity with OurCommunity!
      </p>
    </div>
  );
};

export default function DonatePage() {
  return (
    <div className="w-[100%] flex flex-col justify-start pb-10 items-center min-h-screen bg-gradient-to-tr from-white via-blue-50 to-white/90">
      <div className="md:w-[80%] w-full flex flex-col justify-center items-center">
        <DonationForm />
        <div className="w-[90%] md:w-[100%] min-h-[500px] flex md:flex-row flex-col-reverse gap-3 justify-between ">
          <div className="md:w-[40%]">
            <GenerateCertificateForm />
          </div>
          <div className="md:w-[60%] flex justify-center items-center">
            <CommunityPageHeading />
          </div>
        </div>
      </div>
    </div>
  );
}
