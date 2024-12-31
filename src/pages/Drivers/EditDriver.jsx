import React, { useState } from "react";
import { FaUser, FaIdCard, FaCar, FaTable } from "react-icons/fa";
import Sidebar from "../../components/layout/Sidebar";
import MobileToolbar from "../../components/layout/MobileToolbar";
import DriverData from "./DriverData";
import LicenseData from "./LicenseData";
import CarData from "./CarData";
import { API_BASE_URL } from "../../config/config/apiConfig";
import { useParams } from "react-router-dom"; // Importar useParams
import { useNavigate } from "react-router-dom";
import ListLicenses from "../Licenses/ListLicenses";

const EditDriver = () => {
  const navigate = useNavigate();
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
        return <ListLicenses driverId={driverId} />; // Pasar driverId si es necesario
      case "vehicles":
        return <CarData driverId={driverId} />; // Pasar driverId si es necesario
      default:
        return null;
    }
  };

  return (
    <div className="flex max-h-screen md:min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeItem="Detail Driver"
      />

      <div className="flex-1 overflow-auto">
        {/* Mobile Toolbar */}
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title="Editar Conductor"
        />

        {/* Page Content */}
        <main className="p-4 bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-900">
                EDITAR
                <span className="hidden md:inline"> CONDUCTOR</span>
              </h2>
              <button
                onClick={() => navigate("/list-drivers")}
                className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
              >
                <FaTable />
                <span className="hidden md:inline">Lista de Conductores</span>
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex overflow-auto justify-around mb-6 border-b w-full">
              <button
                className={`flex items-center gap-2 py-2 px-4 ${
                  activeTab === "personalData"
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("personalData")}
              >
                <FaUser /> Conductor
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
