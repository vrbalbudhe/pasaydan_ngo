import GenerateCertificateForm from "@/components/donate/generateCertificateCard";


const CommunityPageHeading = () => {
  return (
    <div className="w-full pl-2 min-h-[250px] flex flex-col justify-center">
      <h1 className="md:text-6xl text-4xl font-semibold text-slate-800">
        Download
        <span className="font-bold text-[#1a237e] md:ml-2 block md:inline-block">
          Certificates
        </span>
      </h1>
      <p className="md:w-[90%] w-full text-pretty py-5 -tracking-tight text-slate-700 text-base md:text-lg">
        Join us in transforming lives and building a stronger community. Through
        your support and our dedicated efforts, we bring hope, resources, and
        opportunities to those in need. Together, we can create a brighter
        future for everyone. Witness the power of unity with OurCommunity!
      </p>
    </div>
  );
};

export default function CertificatePage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-white via-blue-50 to-white/90">
      <div className="container mx-auto px-4 py-8 md:py-16 h-full">
        <div className="w-full min-h-[calc(100vh-8rem)] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <div className="w-full md:w-[45%] flex items-center">
            <CommunityPageHeading />
          </div>
          <div className="w-full md:w-[45%] flex justify-center items-center">
            <div className="w-full max-w-md">
              <GenerateCertificateForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}