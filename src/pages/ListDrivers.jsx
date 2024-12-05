import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const ListDrivers = () => {
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
          <h1 className="ml-4 text-xl font-bold">Drivers</h1>
        </header>

        {/* Content */}
        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">List of Drivers</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Register Driver</button>
          </div>

          {/* Search */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded px-4 py-2 flex-1"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded">Clear</button>
          </div>

          {/* Table */}
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-blue-100">
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Operations</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2">John Doe</td>
                <td className="px-4 py-2">john.doe@example.com</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600">Edit</button>
                  <button className="text-green-600 ml-2">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default ListDrivers;
