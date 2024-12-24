"use client";
import CreateManageForm from "@/components/Admin/a_ManageDrives/createDriveForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function ManageDrives() {
  const [showForm, setShowForm] = useState(false);
  const toggleFormSwitch = () => {
    setShowForm((prev) => !prev);
  };
  return (
    <div className="w-full min-h-screen">
      <div className="w-full h-20 flex justify-between items-center">
        <h1 className="-tracking-tight text-slate-800 text-2xl">
          Manage Drives
        </h1>
        <Link href="/pasaydan/admin/drives">
          <Button onClick={() => toggleFormSwitch()}>
            {showForm ? "Remove" : "Create Drive"}
          </Button>
        </Link>
      </div>
      <div className="relative w-full top-10 left-1/2 transform -translate-x-1/2 flex justify-center items-start pt-10 pb-10">
        {showForm && <CreateManageForm />}
      </div>
    </div>
  );
}
