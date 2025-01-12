"use client";
import CreateManageForm from "@/components/Admin/a_ManageDrives/createDriveForm";
import { AdminDriveCards } from "@/components/Admin/a_ManageDrives/driveAdminCards";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Inbox } from "lucide-react";

export default function ManageDrives() {
  const [showForm, setShowForm] = useState(false);

  const toggleFormSwitch = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <div className="w-full min-h-screen relative bg-gray-50">
      <div className="w-full h-20 mt-14 flex justify-between items-center px-4">
      <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded-lg">
            <Inbox className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Drives</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage drives </p>
          </div>
        </div>
        <Link href="/pasaydan/admin/drives">
          <Button className="bg-black" onClick={() => toggleFormSwitch()}>
            {showForm ? "Remove" : "Create Drive"}
          </Button>
        </Link>
      </div>
      <AdminDriveCards />

      {/* Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-center items-start overflow-auto bg-black/50 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl bg-white p-6 mt-10 mb-10">
            <button
              className="absolute top-10 right-10 bg-red-400 px-2.5 font-semibold text-white py-1 rounded-full hover:text-gray-800"
              onClick={toggleFormSwitch}
            >
              ✕
            </button>
            <CreateManageForm />
          </div>
        </div>
      )}
    </div>
  );
}
