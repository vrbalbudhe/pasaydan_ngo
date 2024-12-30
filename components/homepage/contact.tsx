"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

// Define the structure of the form data
interface FormData {
  fullname: string;
  email: string;
  message: string;
}

function ContactUs() {
  // Type the state for form data, success, and error
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Type the handleChange function to handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Type the handleContactUs function for form submission
  const handleContactUs = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await axios.post(
        "http://localhost:8000/pasaydan/contact/makeRequest",
        formData,
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        setSuccess(true);
        setFormData({ fullname: "", email: "", message: "" });
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError("Failed to send message. Please try again later.");
      }
    } catch (error) {
      setError("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="w-full h-fit flex md:pt-20 md:pb-20 pt-0 pb-0 justify-center items-center py-2 pl-2 pr-2 md:pr-2 md:pl-2">
      <div className="w-[30%] h-full flex pl-2 p-2 justify-center items-center flex-col">
        <h1 className="p-2 w-full h-[50%] text-7xl font-extrabold text-blue-500">
          Contact us
        </h1>
        <h1 className="p-5 w-full h-[50%] -tracking-tight text-md pl-2 text-slate-800 font-semibold">
          In case you have any query, or want any details about the type of{" "}
          <span className="text-blue-500 font-extrabold">Donations</span> or
          want to donate/ Participate in Our
          <span className="text-blue-500 font-extrabold">
            {" "}
            Cycle Donation Drive.
          </span>
        </h1>
        <h1 className="text-2xl text-slate-800 font-bold text-left w-full p-2">
          Feel Free To Connect With Us!
        </h1>
      </div>
      <div className="w-[50%] bg-white p-6 rounded-3xl shadow-md border-t border-r border-l">
        <div className="w-full flex justify-between items-center mb-6">
          <h2 className="w-1/2 text-2xl font-bold -tracking-tight">
            Contact us
          </h2>
        </div>

        <form onSubmit={handleContactUs} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullname"
                className="block text-md font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                id="fullname"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Your full name"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-md font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-md font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6495ed] focus:border-[#6495ed] sm:text-sm"
              placeholder="Write your message here..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-start items-start h-full">
            <button
              type="submit"
              className="group relative w-full md:w-1/2 lg:w-1/3 py-2 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-[#032d60] hover:bg-[#6495ed] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Message
            </button>
          </div>

          {success && (
            <p className="text-green-600 text-center text-sm mt-4">
              Thank you for reaching out! We will get back to you shortly.
            </p>
          )}
          {error && (
            <p className="text-red-600 text-center text-sm mt-4">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
