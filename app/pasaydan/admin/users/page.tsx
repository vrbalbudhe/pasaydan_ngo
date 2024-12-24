import UsersTable from "@/components/Admin/a_ManageUser/usersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function ManageUser() {
  return (
    <div className="w-full min-h-screen">
      <div className="w-full h-40 flex flex-col justify-between items-start">
        <div className="-tracking-tight w-full h-1/3 text-slate-800 text-2xl">
          Manage Users
        </div>
        <div className="h-2/3 -tracking-tight w-full flex justify-start items-center gap-5 text-slate-800 text-2xl">
          <p className="w-[60%]">
            <Input type="search" id="search" placeholder="Search User" />
          </p>
          <Button>Search</Button>
        </div>
      </div>
      <div className="w-full h-full flex justify-between items-center">
        <UsersTable />
      </div>
    </div>
  );
}
