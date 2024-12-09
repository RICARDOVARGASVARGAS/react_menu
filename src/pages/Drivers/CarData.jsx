import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading"; // Componente de carga
import { FaPlus, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CarData = ({ driverId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Para navegación entre páginas

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://secov_back.test/api/getCarsByDriver/${driverId}`
      );
      const result = await response.json();

      if (result.data) {
        setVehicles(result.data);
      } else {
        setVehicles([]);
        toast.info("El conductor no tiene vehículos registrados.");
      }
    } catch (error) {
      toast.error("Error al cargar los vehículos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [driverId]);

  const handleAddVehicle = () => {
    navigate(`/add-car?driverId=${driverId}`);
  };

  const handleEditVehicle = (vehicleId) => {
    navigate(`/edit-car/${vehicleId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Vehículos del Conductor
          </h2>
          <button
            onClick={handleAddVehicle}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <FaPlus /> Agregar Vehículo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Placa</th>
                <th className="border px-2 py-1">Motor</th>
                <th className="border px-2 py-1">Características</th>
                <th className="border px-2 py-1">Tipo</th>
                <th className="border px-2 py-1">Grupo</th>
                <th className="border px-2 py-1">SOAT</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="border px-2 py-1 text-center">{vehicle.plate}</td>
                  <td className="border px-2 py-1">
                    <div className="flex flex-col">
                      <span>
                        <strong>Motor:</strong> {vehicle.motor}
                      </span>
                      <span>
                        <strong>Chassis:</strong> {vehicle.chassis}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1">
                    <div className="flex flex-col">
                      <span>
                        <strong>Marca:</strong> {vehicle.brand?.name}
                      </span>
                      <span>
                        <strong>Modelo:</strong> {vehicle.example.name}
                      </span>
                      <span>
                        <strong>Año:</strong> {vehicle.year.name}
                      </span>
                      <span className="flex items-center">
                        <strong>Color:</strong>
                        <span
                          className="ml-2 w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: vehicle.color?.hex || "#fff",
                          }}
                        ></span>
                        <span className="ml-1">{vehicle.color?.name}</span>
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-center">{vehicle.typeCar?.name}</td>
                  <td className="border px-2 py-1 text-center">{vehicle.group?.name}</td>
                  <td className="border px-2 py-1">
                    <div>
                      <span>{vehicle.number_soat}</span>
                      <div className="flex flex-col">
                        <span>
                          <strong>F.Vig:</strong>  <br />{vehicle.date_soat_issue}
                        </span>
                        <span>
                          <strong>F.Ven:</strong><br />
                          {vehicle.date_soat_expiration}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => handleEditVehicle(vehicle.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                    >
                      <FaEdit /> Editar
                    </button>
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

export default CarData;
