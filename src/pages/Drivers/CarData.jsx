import React, { useState } from "react";
import { toast } from "react-toastify";

const CarData = () => {
  const [vehicle, setVehicle] = useState({
    vehiclePlate: "",
    model: "",
    year: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://secov_back.test/api/updateVehicle", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicle),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Vehículo actualizado correctamente");
      } else {
        toast.error("Error al actualizar los datos del vehículo");
      }
    } catch (error) {
      toast.error("Ocurrió un error al actualizar");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Editar Datos del Vehículo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-gray-700">Placa del Vehículo</label>
          <input
            type="text"
            name="vehiclePlate"
            value={vehicle.vehiclePlate}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Modelo</label>
          <input
            type="text"
            name="model"
            value={vehicle.model}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Año</label>
          <input
            type="text"
            name="year"
            value={vehicle.year}
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

export default CarData;
