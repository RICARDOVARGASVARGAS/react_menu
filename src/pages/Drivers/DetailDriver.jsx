import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import MobileToolbar from "../../components/MobileToolbar";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";

const defaultImage = "https://via.placeholder.com/640x480.png?text=No+Image";

const VehicleCard = ({ car }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
    <div className="p-4">
      <h3 className="text-lg font-bold text-blue-800 mb-3">Detalles del Vehículo</h3>
      <p>
        <strong>Placa:</strong> {car.plate || "No disponible"}
      </p>
      <p>
        <strong>Chasis:</strong> {car.chassis || "No disponible"}
      </p>
      <p>
        <strong>Motor:</strong> {car.motor || "No disponible"}
      </p>
      <p>
        <strong>SOAT:</strong> {car.number_soat || "No disponible"}
      </p>
      <p>
        <strong>Fecha de Emisión SOAT:</strong> {car.date_soat_issue || "No disponible"}
      </p>
      <p>
        <strong>Fecha de Expiración SOAT:</strong> {car.date_soat_expiration || "No disponible"}
      </p>
      <p>
        <strong>Marca:</strong> {car.brand?.name || "No disponible"}
      </p>
      <p>
        <strong>Tipo:</strong> {car.type_car?.name || "No disponible"}
      </p>
      <p>
        <strong>Grupo:</strong> {car.group?.name || "No disponible"}
      </p>
      <p>
        <strong>Año:</strong> {car.year?.name || "No disponible"}
      </p>
      <p>
        <strong>Color:</strong> {car.color?.name || "No disponible"}
      </p>
    </div>
    <div className="grid grid-cols-2 gap-2 p-4">
      {car.file_soat && (
        <img
          src={car.file_soat}
          alt="SOAT"
          className="w-full h-40 object-cover rounded-lg"
          onError={(e) => (e.target.src = defaultImage)}
        />
      )}
      {car.file_car && (
        <img
          src={car.file_car}
          alt="Vehículo"
          className="w-full h-40 object-cover rounded-lg"
          onError={(e) => (e.target.src = defaultImage)}
        />
      )}
    </div>
  </div>
);

const DetailDriver = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [driverData, setDriverData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { driverId } = useParams();

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://secov_back.test/api/getDriver/${driverId}?included=cars.brand,cars.typeCar,cars.group,cars.year,cars.color,cars.example`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setDriverData(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriverData();
  }, [driverId]);

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Error al cargar la información: {error}</p>
      </div>
    );
  }

  if (!driverData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">
          No se encontró información del conductor.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeItem="Detail Driver"
      />

      <div className="flex-1">
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title="Detalle del Conductor"
        />

        <main className="p-4 bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-blue-900">Detalle del Conductor</h1>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Volver
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg shadow">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Información Personal</h2>
                <p><strong>Nombre:</strong> {driverData.name || "No disponible"}</p>
                <p><strong>Documento:</strong> {driverData.document_type} {driverData.document_number}</p>
                <p><strong>Teléfono:</strong> {driverData.phone_number || "No disponible"}</p>
                <p><strong>Email:</strong> {driverData.email || "No disponible"}</p>
                <p><strong>Dirección:</strong> {driverData.address || "No disponible"}</p>
                <p><strong>Fecha de Nacimiento:</strong> {driverData.birth_date || "No disponible"}</p>
                <p><strong>Género:</strong> {driverData.gender || "No disponible"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Licencia</h2>
                <p><strong>Número:</strong> {driverData.license_number || "No disponible"}</p>
                <p><strong>Fecha de Emisión:</strong> {driverData.license_issue_date || "No disponible"}</p>
                <p><strong>Fecha de Expiración:</strong> {driverData.license_expiration_date || "No disponible"}</p>
                <p><strong>Clase:</strong> {driverData.license_class || "No disponible"}</p>
                <p><strong>Categoría:</strong> {driverData.license_category || "No disponible"}</p>
                <img
                  src={driverData.image_license || defaultImage}
                  alt="Licencia"
                  className="w-full h-40 object-cover mt-4 rounded-lg"
                  onError={(e) => (e.target.src = defaultImage)}
                />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Vehículos Asociados</h2>
              {driverData.cars && driverData.cars.length > 0 ? (
                driverData.cars.map((car) => <VehicleCard key={car.id} car={car} />)
              ) : (
                <p className="text-gray-600">No hay vehículos asociados.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailDriver;
