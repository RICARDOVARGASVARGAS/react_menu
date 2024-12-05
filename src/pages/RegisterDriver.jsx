import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const RegisterDriver = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1">
        {/* Toolbar */}
        <header className="bg-blue-600 text-white flex items-center h-16 px-4 shadow lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <h1 className="ml-4 text-xl font-bold">Register Driver</h1>
        </header>

        {/* Content */}
        <main className="p-4">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">Register a New Driver</h1>
          <form>
            {/* Form Fields */}
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                placeholder="Enter name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                placeholder="Enter email"
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default RegisterDriver;
