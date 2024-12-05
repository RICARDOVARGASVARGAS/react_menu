// Home.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileToolbar from "../components/MobileToolbar";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1">
        {/* Usamos el componente MobileToolbar en lugar de repetir código */}
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title="HOME"
        />
        {/* Content */}
        <main className="p-4">
          <h1 className="text-4xl font-bold text-blue-900">Welcome to SECoV</h1>
          <p className="mt-2 text-gray-700">
            Use the menu on the left to navigate through the system.
          </p>
        </main>
      </div>
    </div>
  );
};

export default Home;
