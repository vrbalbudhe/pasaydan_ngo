import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import Link from "next/link";

export default async function UserInformation() {
  const headersList = await headers();
  const userHeader = headersList.get("x-user");
  console.log("userheader->> ", userHeader);
  if (!userHeader) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/pasaydan/auth/logsign">
          <Button
            variant="outline"
            className="-tracking-tighter bg-[#4361ee] rounded-[10px] border-none text-white shadow-sm shadow-slate-100"
          >
            Login
          </Button>
        </Link>
      </div>
    );
  }

  try {
    const user = JSON.parse(userHeader);
    return (
      <div className="flex items-center space-x-2 gap-2">
        <Avatar>
          <AvatarFallback className="border-2 bg-slate-100">
            {user.email?.[0]?.toUpperCase() || "*"}
          </AvatarFallback>
        </Avatar>
        <Link href="/pasaydan/com/profile">
          <Button
            variant="outline"
            className="-tracking-tighter bg-[#4361ee] rounded-[10px] border-none text-white shadow-sm shadow-slate-100"
          >
            Profile
          </Button>
        </Link>
      </div>
    );
  } catch (error) {
    console.error("Error parsing userHeader:", error);
    return (
      <div className="flex items-center space-x-4">
        <Link href="/pasaydan/auth/logsign">
          <Button
            variant="outline"
            className="-tracking-tighter bg-[#4361ee] rounded-[10px] border-none text-white shadow-sm shadow-slate-100"
          >
            Login
          </Button>
        </Link>
      </div>
    );
  }
}
