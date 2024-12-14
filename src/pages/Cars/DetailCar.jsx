import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import MobileToolbar from "../../components/MobileToolbar";
import Loading from "../../components/Loading";

const DetailCar = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(
          `http://secov_back.test/api/getCar/${carId}?included=driver,brand,typeCar,group,year,color,example`
        );
        setCar(response.data.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) {
    return <Loading />;
  }

  if (!car) {
    return <div className="p-4">No se encontró la información del auto.</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeItem="Cars"
      />

      <div className="flex-1">
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title={`Detalles del Auto - ${car.plate}`}
        />

        <main className="p-4">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Detalles del Auto
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Información Básica</h2>
              <p>
                <strong>Placa:</strong> {car.plate}
              </p>
              <p>
                <strong>Chasis:</strong> {car.chassis}
              </p>
              <p>
                <strong>Motor:</strong> {car.motor}
              </p>
              <p>
                <strong>Año:</strong> {car.year.name}
              </p>
              <p>
                <strong>Color:</strong> {car.color.name}
              </p>
              <p>
                <strong>Modelo:</strong> {car.example.name}
              </p>
              <p>
                <strong>Marca:</strong> {car.brand.name}
              </p>
              <p>
                <strong>Asociado a:</strong> {car.group.name}
              </p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">
                Información del SOAT
              </h2>
              <p>
                <strong>Número SOAT:</strong> {car.number_soat}
              </p>
              <p>
                <strong>Fecha de Emisión:</strong> {car.date_soat_issue}
              </p>
              <p>
                <strong>Fecha de Expiración:</strong> {car.date_soat_expiration}
              </p>
              <img
                src={car.file_soat}
                alt="Archivo SOAT"
                className="mt-4 rounded"
              />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">
                Documentos y Archivos
              </h2>
              <img
                src={car.file_car}
                alt="Imagen del Auto"
                className="rounded mb-4"
              />
              <img
                src={car.file_technical_review}
                alt="Revisión Técnica"
                className="rounded"
              />
            </div>

            <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold mb-2">
                Información del Conductor
              </h2>
              <p>
                <strong>Nombre:</strong> {car.driver.name}{" "}
                {car.driver.first_name} {car.driver.last_name}
              </p>
              <p>
                <strong>Documento:</strong> {car.driver.document_type} -{" "}
                {car.driver.document_number}
              </p>
              <p>
                <strong>Teléfono:</strong> {car.driver.phone_number}
              </p>
              <p>
                <strong>Email:</strong> {car.driver.email}
              </p>
              <p>
                <strong>Dirección:</strong> {car.driver.address}
              </p>
              <img
                src={car.driver.image}
                alt="Foto del Conductor"
                className="mt-4 rounded"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailCar;
