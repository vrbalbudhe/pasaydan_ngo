"use client";

import { useState } from "react";
import AddParticipantsForm from "./addParticipantsForm";

export default function AddParticipants() {
  const [openForm, setOpenForm] = useState(false);
  const toggleFormChange = () => {
    setOpenForm((prev) => !prev);
  };

  return (
    <div className="w-full min-h-fit bg-inherit">
      <div
        onClick={toggleFormChange}
        className="rounded-none w-fit px-2 py-2 bg-blue-500 md:hover:scale-95 transition-all duration-300 cursor-pointer"
      >
        <p className="font-semibold text-md text-white tracking-tight">
          Add Participants
        </p>
      </div>
      {openForm && (
        <div className="fixed inset-0 h-full flex justify-center items-center z-50 backdrop-blur-xl bg-black/30">
          <div className="relative w-full md:minw-fit h-fit md:min-h-[80%] md:p-6 p-3">
            {/* Close Button */}
            <button
              className="absolute top-8 md:top-11 right-10 text-gray-600 hover:text-red-500 text-4xl md:text-2xl font-bold cursor-pointer transition-transform transform hover:scale-110"
              onClick={() => toggleFormChange()}
            >
              ×
            </button>

            {/* Form Content */}
            <AddParticipantsForm />
          </div>
        </div>
      )}
    </div>
  );
}
