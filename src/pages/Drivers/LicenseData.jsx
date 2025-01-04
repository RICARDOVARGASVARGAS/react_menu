import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading"; // Importar el componente de carga
import { FaEdit } from "react-icons/fa";
import {API_BASE_URL} from "../../config/enviroments";

const LicenseData = ({ driverId }) => {
  const [license, setLicense] = useState({
    licenseNumber: "",
    issueDate: "",
    expirationDate: "",
    licenseClass: "",
    licenseCategory: "",
  });
  const [fullDriverData, setFullDriverData] = useState(null); // Para guardar todos los datos
  const [loading, setLoading] = useState(false);

  // Cargar datos del conductor al cargar el componente
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/getDriver/${driverId}`);
        const result = await response.json();

        if (result.data) {
          setFullDriverData(result.data); // Guardar todos los datos
          setLicense({
            licenseNumber: result.data.license_number || "",
            issueDate: result.data.license_issue_date || "",
            expirationDate: result.data.license_expiration_date || "",
            licenseClass: result.data.license_class || "",
            licenseCategory: result.data.license_category || "",
          });
        } else {
          toast.error("No se encontraron datos del conductor.");
        }
      } catch (error) {
        toast.error("Error al cargar los datos del conductor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [driverId]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLicense({ ...license, [name]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullDriverData) {
      toast.error("No se pueden enviar los datos debido a un error previo.");
      return;
    }

    try {
      setLoading(true);

      // Crear objeto con los datos actualizados
      const updatedData = {
        ...fullDriverData,
        license_number: license.licenseNumber,
        license_issue_date: license.issueDate,
        license_expiration_date: license.expirationDate,
        license_class: license.licenseClass,
        license_category: license.licenseCategory,
      };

      const response = await fetch(`${API_BASE_URL}/updateDriver/${driverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const { data, message, errors } = await response.json();

      if (data) {
        toast.success(message);
      } else {
        setErrors(errors);
        toast.error(message);
      }
    } catch (error) {
      toast.error("Ocurrió un error al actualizar los datos.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />; // Mostrar componente de carga mientras loading sea verdadero
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Editar Datos de Licencia</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-gray-700">Número de Licencia</label>
          <input
            type="text"
            name="licenseNumber"
            value={license.licenseNumber || ""}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Fecha de Emisión</label>
          <input
            type="date"
            name="issueDate"
            value={license.issueDate || ""}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">
            Fecha de Expiración
          </label>
          <input
            type="date"
            name="expirationDate"
            value={license.expirationDate || ""}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Clase de Licencia</label>
          <input
            type="text"
            name="licenseClass"
            value={license.licenseClass || ""}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">
            Categoría de Licencia
          </label>
          <input
            type="text"
            name="licenseCategory"
            value={license.licenseCategory || ""}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 mx-auto flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar Licencia"}
            <FaEdit />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LicenseData;
