import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading"; // Componente de carga
import { FaPlus, FaEdit, FaFilePdf, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {API_BASE_URL} from "../../config/config/apiConfig";
import RegisterLicense from "./RegisterLicense";

const ListLicenses = ({ driverId }) => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [typeModal, setTypeModal] = useState(null);
  const [selectedLicenseId, setSelectedLicenseId] = useState(null);

  const navigate = useNavigate(); // Para navegación entre páginas

  // Obtener la lista de licencias
  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/getDriverLicenses/${driverId}`
      );
      const { data } = await response.json();
      //   console.log(data);
      if (data) {
        setLicenses(data);
      } else {
        setLicenses([]);
        toast.info("El conductor no tiene licencias registradas.");
      }
    } catch (error) {
      toast.error("Error al cargar los licencias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, [driverId]);

  // Abrir el modal
  const showModal = (type) => {
    setModal(true);
    setTypeModal(type);
  };

  // Cerrar el modal
  const closeModal = () => {
    setModal(false);
    setTypeModal(null);
    fetchLicenses();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Licencias del Conductor
          </h2>
          <button
            onClick={() => showModal("register")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <FaPlus /> Agregar <p className="hidden md:block">Licencia</p>
          </button>
        </div>
        {/* Tabla de licencias */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">N° Licencia</th>
                <th className="border px-2 py-1">Clase</th>
                <th className="border px-2 py-1">Fecha</th>
                <th className="border px-2 py-1">Estado</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => (
                <tr key={license.id}>
                  <td className="border px-2 py-1 text-center">
                    {license.number}
                  </td>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>Categoria:</strong> {license.category || "N/A"}
                      </span>
                      <span>
                        <strong>Clase:</strong> {license.class || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>F. Inicio:</strong>{" "}
                        {license.issue_date || "No disponible"}
                      </span>
                      <span>
                        <strong>F. Revalidación:</strong>{" "}
                        {license.renewal_date || "No disponible"}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {license.status === "active" ? (
                      <span className="px-2 py-1 rounded-full text-white font-semibold bg-green-500">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-white font-semibold bg-red-500">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="border px-2 py-1 text-center space-x-2 space-y-1">
                    <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
                      <FaEdit className="inline-block mr-1" /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal de Agregar Vehículo */}
      {modal && typeModal === "register" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <RegisterLicense onClose={closeModal} driverId={driverId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListLicenses;
