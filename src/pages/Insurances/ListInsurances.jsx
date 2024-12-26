import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading"; // Componente de carga
import {
  FaPlus,
  FaEdit,
  FaFilePdf,
  FaImage,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import {
  API_BASE_URL,
  API_STORAGE_URL,
  TOKEN_API_STORAGE,
} from "../../config/config/apiConfig";

const ListInsurances = ({ carId }) => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener la lista de seguros
  const fetchInsurances = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getInsurances/${carId}`);
      const { data } = await response.json();
      if (data) {
        setInsurances(data);
      } else {
        setInsurances([]);
        toast.info("El vehículo no tiene seguros registrados.");
      }
    } catch (error) {
      toast.error("Error al cargar los licencias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, [carId]);

  return (
    <div>
      {loading && <Loading />}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Seguros del Vehiculo
          </h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2">
            <FaPlus /> Agregar <p className="hidden md:block">Seguro</p>
          </button>
        </div>
        {/* Tabla de seguros */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">N° Seguro</th>
                <th className="border px-2 py-1">Fecha</th>
                <th className="border px-2 py-1">Seguro</th>
                <th className="border px-2 py-1">Estado</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {insurances.map((insurance) => (
                <tr key={insurance.id}>
                  <td className="border px-2 py-1 text-center">
                    {insurance.number_insurance}
                  </td>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>F. Inicio:</strong>{" "}
                        {insurance.issue_date || "N/A"}
                      </span>
                      <span>
                        <strong>F. Revalidación:</strong>{" "}
                        {insurance.renewal_date || "N/A"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListInsurances;
