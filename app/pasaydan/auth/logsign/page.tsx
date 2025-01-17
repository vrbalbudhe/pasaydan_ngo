import React from "react";
import { LoginSignup } from "@/components/auth/LoginSignup";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center overflow-hidden relative bg-slate-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
        <div
          className="absolute h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-blue-400">
                Welcome to
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                <span className="block">Join Our</span>
                <span className="block text-blue-500">पसायदान</span>
                <span className="text-4xl md:text-5xl block mt-2 text-gray-300">
                  NGO & Community
                </span>
              </h1>
            </div>

            <p className="text-gray-400 text-lg max-w-xl">
              Together we can make a difference. Join our community of
              change-makers and help us create a better world for everyone.
            </p>

            <div className="hidden md:flex gap-4 mt-8">
              <div className="h-2 w-12 rounded-full bg-blue-500"></div>
              <div className="h-2 w-8 rounded-full bg-purple-500"></div>
              <div className="h-2 w-4 rounded-full bg-pink-500"></div>
            </div>
          </div>

          <div className="md:w-1/2 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <LoginSignup />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </div>
  );
};

export default LoginPage;
