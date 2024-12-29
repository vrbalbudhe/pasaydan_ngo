import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import Link from "next/link";

interface User {
  email?: string;
  guest: boolean;
}

export default async function UserInformation() {
  try {
    const headersList = await headers();
    const userHeader = headersList.get("x-user");
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

    const user: User = JSON.parse(userHeader);

    if (user.guest) {
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
    return (
      <div className="flex items-center space-x-2 gap-2">
        <Avatar>
          <AvatarFallback className="border-2 bg-slate-100">
            {user.email ? user.email[0].toUpperCase() : "*"}
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
    console.error("Error processing user information:", error);
    return (
      <div>
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
