import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileToolbar from "./MobileToolbar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex max-h-screen md:min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeItem={null} // Este puede ser gestionado a nivel de cada página
      />
      <div className="flex-1 overflow-auto">
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title="SECOV" // Cambiar título según la página activa es opcional
        />
        <main className="p-4">
          <Outlet /> {/* Aquí se cargarán las páginas específicas */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
