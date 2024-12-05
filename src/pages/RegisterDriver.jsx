import React, { useState } from "react";
import MobileToolbar from "../components/MobileToolbar";
import Sidebar from "../components/Sidebar";

const RegisterDriver = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1">
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title="REGISTER DRIVER"
        />

        {/* Content */}
        <main className="p-4">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Register a New Driver
          </h1>
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Submit
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default RegisterDriver;
