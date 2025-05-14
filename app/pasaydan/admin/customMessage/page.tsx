"use client";

import { useState, useEffect } from "react";
import CustomMessageGenerator from "@/components/Admin/a_CustomMessage/CustomMessageGenerator";

export default function CustomMessagePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Custom Drive Messages</h1>
      <p className="text-gray-600 mb-8">
        Generate customized messages for your donation drives in multiple languages 
        that can be shared via WhatsApp and other platforms.
      </p>
      
      <CustomMessageGenerator />
    </div>
  );
}