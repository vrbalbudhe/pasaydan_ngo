import Link from "next/link";
import Navigator from "../../components/navbar/navigator";
import UserInformation from "./userInformation";

const Navbar = async () => {
  return (
    <div className="w-[95%] md:w-[92%] h-[70px] flex justify-between items-center p-5">
      {/* Logo */}
      <Link href="/pasaydan/com">
        <p className="-tracking-tighter text-xl text-slate-800">Pasaydan</p>
      </Link>

      <Navigator />
      <div className="flex justify-center items-center gap-5">
        <UserInformation />
      </div>
    </div>
  );
};

export default Navbar;
