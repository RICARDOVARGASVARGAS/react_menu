import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const Home = () => {
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
          <h1 className="ml-4 text-xl font-bold">SECoV</h1>
        </header>

        {/* Content */}
        <main className="p-4">
          <h1 className="text-4xl font-bold text-blue-900">Welcome to SECoV</h1>
          <p className="mt-2 text-gray-700">Use the menu on the left to navigate through the system.</p>
        </main>
      </div>
    </div>
  );
};

export default Home;
