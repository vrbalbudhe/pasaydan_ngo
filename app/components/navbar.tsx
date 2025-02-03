import Link from "next/link";
import Navigator from "../../components/navbar/navigator";
import UserInformation from "./userInformation";
import Image from "next/image"; // Import the Next.js Image component
import logo from "@/assets/homepage/logo.png";

const Navbar = async () => {
  return (
    <div className="w-[100%] md:w-[92%] h-[70px] flex justify-between items-center md:p-5 pl-5 pr-5">
      {/* Logo */}
      <Link href="/pasaydan/com" className="flex items-center gap-2">
        <Image className="rounded-full w-10 h-10 object-cover" src={logo.src} alt="Pasaydan Logo" width={40} height={50} />
        <p className="-tracking-tighter text-lg text-slate-500">Pasaydan</p>
      </Link>

      <Navigator />
      <div className="flex justify-center items-center gap-5">
        <UserInformation />
      </div>
    </div>
  );
};

export default Navbar;
