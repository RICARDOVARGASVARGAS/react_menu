import { useParams } from "react-router-dom";
import {
  FileText,
  User,
  Car,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  FileCheck,
  ArrowLeft,
  FilePen,
} from "lucide-react";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { apiGet } from "../../services/apiService";
import { useNavigate } from "react-router-dom";

const DetailDriver = () => {
  const [driverData, setDriverData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { driverId } = useParams();
  const navigate = useNavigate();

  const fechtData = async () => {
    setIsLoading(true);
    const { data } = await apiGet(`getDriver/${driverId}`, {
      included:
        "cars.brand,cars.typeCar,cars.group,cars.year,cars.color,cars.example,latestLicense,cars.inspections,cars.insurances,cars.permits,cars.latestInspection,cars.latestInsurance,cars.latestPermit",
    });
    // console.log(data);
    setDriverData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fechtData();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between">
          <button
            onClick={() => navigate(`/driver-data/${driverId}`)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <FilePen className="w-4 h-4" />
            <span className="hidden md:inline">Editar</span>
          </button>
          <button
            onClick={() => navigate("/list-drivers")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Volver</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Información Personal
              </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={driverData?.image_url || "/images/no-image.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {driverData?.file_driver && (
                  <a
                    href={driverData?.file_driver_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden md:inline">Ver Documento</span>
                  </a>
                )}
              </div>
              {/* Rest of personal information remains the same */}
              <div className="flex-grow grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Nombre</p>
                  <p className="font-semibold capitalize">{driverData?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Documento</p>
                  <p className="font-semibold uppercase">
                    {driverData?.document_type} {driverData?.document_number}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-600">Teléfono</p>
                    <p className="font-semibold">
                      {driverData?.phone_number || "No disponible"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">
                      {driverData?.email || "No disponible"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-600">Dirección</p>
                    <p className="font-semibold">
                      {driverData?.address || "No disponible"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-600">Fecha de Nacimiento</p>
                    <p className="font-semibold">{driverData?.birth_date}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Género</p>
                  <p className="font-semibold">
                    {driverData?.gender === "M" ? "Masculino" : "Femenino"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* License Information Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Licencia</h2>
              </div>
              {driverData?.latest_license?.file && (
                <a
                  href={driverData?.latest_license?.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden md:inline">Ver Archivo
                  </span>
                </a>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  label: "Número",
                  value: `${
                    driverData?.latest_license?.number || "No disponible"
                  }`,
                },
                {
                  label: "Fecha de Emisión",
                  value: `${
                    driverData?.latest_license?.issue_date || "No disponible"
                  }`,
                },
                {
                  label: "Fecha de Expiración",
                  value: `${
                    driverData?.latest_license?.renewal_date || "No disponible"
                  }`,
                },
                {
                  label: "Clase",
                  value: `${
                    driverData?.latest_license?.class || "No disponible"
                  }`,
                },
                {
                  label: "Categoría",
                  value: `${
                    driverData?.latest_license?.category || "No disponible"
                  }`,
                },
              ].map((item, index) => (
                <div key={index}>
                  <p className="text-gray-600">{item.label}</p>
                  <p className="font-semibold uppercase">{item.value}</p>
                </div>
              ))}

              <div>
                <p className="text-gray-600">Estado</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{
                      backgroundColor: driverData?.latest_license?.is_valid
                        ? "green"
                        : "red",
                    }}
                  />
                  <p className="font-semibold uppercase">
                    {driverData?.latest_license?.is_valid
                      ? "Activo"
                      : "Inactivo"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {driverData?.cars && driverData?.cars?.length > 0 && (
            <>
              {/* cars Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Car className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Vehículos
                  </h2>
                </div>

                {/* car Cards */}
                {driverData?.cars?.map((car, index) => (
                  <div
                    key={car.id}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Vehículo {index + 1}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-600">Placa</p>
                        <p className="font-semibold">{car.plate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">N° Asientos</p>
                        <p className="font-semibold">{car.number_of_seats}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">N° Chasis</p>
                        <p className="font-semibold">{car.chassis}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">N° Motor</p>
                        <p className="font-semibold">{car.motor}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Marca</p>
                        <p className="font-semibold capitalize">
                          {car.brand?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Modelo/Clase</p>
                        <p className="font-semibold capitalize">
                          {car.example?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tipo</p>
                        <p className="font-semibold capitalize">
                          {car.typeCar?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Año</p>
                        <p className="font-semibold capitalize">
                          {car.year?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Asociación</p>
                        <p className="font-semibold capitalize">
                          {car.group?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">N° de Asociación</p>
                        <p className="font-semibold capitalize">
                          {car.group_number || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Color</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: car.color?.hex }}
                          />
                          <p className="font-semibold capitalize">
                            {car.color?.name}
                          </p>
                        </div>
                      </div>
                      <div className=""></div>
                      {/* SOAT */}
                      <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-gray-800">
                            SOAT
                          </p>
                          <div
                            className={`px-2 py-1 text-sm font-medium rounded uppercase ${
                              car.latest_insurance?.is_valid
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {car.latest_insurance?.is_valid
                              ? "Activo"
                              : "Inactivo"}
                          </div>
                        </div>
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">N° SOAT:</span>
                            <span className="font-medium">
                              {car.latest_insurance?.number_insurance || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Fecha de Emisión:
                            </span>
                            <span className="font-medium">
                              {car.latest_insurance?.issue_date || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Fecha de Expiración:
                            </span>
                            <span className="font-medium">
                              {car.latest_insurance?.expiration_date || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Revisión */}
                      <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-gray-800">
                            Revisión Técnica
                          </p>
                          <div
                            className={`px-2 py-1 text-sm font-medium rounded uppercase ${
                              car.latest_inspection?.is_valid
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {car.latest_inspection?.is_valid
                              ? "Activo"
                              : "Inactivo"}
                          </div>
                        </div>
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Fecha de Emisión:
                            </span>
                            <span className="font-medium">
                              {car.latest_inspection?.issue_date || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Fecha de Expiración:
                            </span>
                            <span className="font-medium">
                              {car.latest_inspection?.expiration_date || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Permiso */}
                      <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-gray-800">
                            Permiso de Circulación
                          </p>
                          <div
                            className={`px-2 py-1 text-sm font-medium rounded uppercase ${
                              car.latest_permit?.is_valid
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {car.latest_permit?.is_valid
                              ? "Activo"
                              : "Inactivo"}
                          </div>
                        </div>
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Fecha de Emisión:
                            </span>
                            <span className="font-medium">
                              {car.latest_permit?.issue_date || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Fecha de Expiración:
                            </span>
                            <span className="font-medium">
                              {car.latest_permit?.expiration_date || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {car.latest_insurance?.file_insurance && (
                        <a
                          href={car.latest_insurance?.file_insurance_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          title="SOAT"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span className="hidden md:inline">SOAT</span>
                        </a>
                      )}
                      {car.latest_permit?.file_permit && (
                        <a
                          href={car.latest_permit?.file_permit_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          title="SOAT"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span className="hidden md:inline">CIRCULACIÓN</span>
                        </a>
                      )}
                      {car.latest_inspection?.file_inspection && (
                        <a
                          href={car.latest_inspection?.file_inspection_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          title="SOAT"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span className="hidden md:inline">REVISIÓN</span>
                        </a>
                      )}
                      {car.file_car && (
                        <a
                          href={car.file_car_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          title="SOAT"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span className="hidden md:inline">DOCUMENTOS</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DetailDriver;
