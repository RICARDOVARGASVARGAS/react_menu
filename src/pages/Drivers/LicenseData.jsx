import React, { useState } from "react";
import { toast } from "react-toastify";

const LicenseData = () => {
  const [license, setLicense] = useState({
    licenseNumber: "",
    issueDate: "",
    expirationDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLicense({ ...license, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://secov_back.test/api/updateLicense", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(license),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Licencia actualizada correctamente");
      } else {
        toast.error("Error al actualizar los datos de la licencia");
      }
    } catch (error) {
      toast.error("Ocurrió un error al actualizar");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Editar Datos de Licencia</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-gray-700">Número de Licencia</label>
          <input
            type="text"
            name="licenseNumber"
            value={license.licenseNumber}
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
            value={license.issueDate}
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
            value={license.expirationDate}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default LicenseData;
