import React, { useState } from "react";
import { FaUser, FaIdCard, FaCar } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import MobileToolbar from "../../components/MobileToolbar";
import DriverData from "./DriverData";
import LicenseData from "./LicenseData";
import CarData from "./CarData";
import { useParams } from "react-router-dom";  // Importar useParams

const EditDriver = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personalData");
  
  // Obtener el driverId desde la URL (si lo tienes en la ruta)
  const { driverId } = useParams();

  // Función para renderizar el contenido basado en la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case "personalData":
        return <DriverData driverId={driverId} />; // Pasar driverId
      case "license":
        return <LicenseData driverId={driverId} />; // Pasar driverId si es necesario
      case "vehicles":
        return <CarData driverId={driverId} />; // Pasar driverId si es necesario
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeItem="Edit Driver"
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Toolbar */}
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title="Editar Conductor"
        />

        {/* Page Content */}
        <main className="p-4 bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h1 className="text-2xl font-bold text-blue-900 mb-6">
              Editar Información del Conductor
            </h1>

            {/* Tabs Navigation */}
            <div className="flex justify-around mb-6 border-b">
              <button
                className={`flex items-center gap-2 py-2 px-4 ${
                  activeTab === "personalData"
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("personalData")}
              >
                <FaUser /> Datos Personales
              </button>
              <button
                className={`flex items-center gap-2 py-2 px-4 ${
                  activeTab === "license"
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("license")}
              >
                <FaIdCard /> Licencia
              </button>
              <button
                className={`flex items-center gap-2 py-2 px-4 ${
                  activeTab === "vehicles"
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("vehicles")}
              >
                <FaCar /> Vehículos
              </button>
            </div>

            {/* Content */}
            <div>{renderContent()}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditDriver;
