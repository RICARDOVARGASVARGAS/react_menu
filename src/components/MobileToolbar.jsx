// MobileToolbar.jsx
import React from "react";

const MobileToolbar = ({ setIsSidebarOpen, title }) => {
  return (
    <header className="bg-blue-600 text-white flex items-center h-16 px-4 shadow lg:hidden">
      <button
        onClick={() => setIsSidebarOpen((prevState) => !prevState)}
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <h1 className="ml-4 text-xl font-bold">{title}</h1>
    </header>
  );
};

export default MobileToolbar;
