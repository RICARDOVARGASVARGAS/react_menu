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
  FileWarning,
  FileCog,
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
    console.log("fechtData");
    const { data } = await apiGet(`getDriver/${driverId}`, {
      included:
        "cars.brand,cars.typeCar,cars.group,cars.year,cars.color,cars.example,latestLicense",
    });

    console.log(data);
    setDriverData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fechtData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-1 md:p-2">
      {isLoading && <Loading />}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between">
          <a
            onClick={() => navigate(`/driver-data/${driverId}`)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <FilePen className="w-4 h-4" />
            <span className="hidden md:inline">Editar</span>
          </a>
          <button
            onClick={() => window.history.back()}
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
                    src={driverData?.image || "/images/no-image.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {driverData?.file_driver && (
                  <a
                    href={driverData?.file_driver}
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
                  href={driverData?.latest_license?.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden md:inline">Ver Archivo</span>
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
                        <p className="text-gray-600">Chasis</p>
                        <p className="font-semibold">{car.chassis}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Motor</p>
                        <p className="font-semibold">{car.motor}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">SOAT</p>
                        <p className="font-semibold">car.soat</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fecha de Emisión SOAT</p>
                        <p className="font-semibold">car.fechaEmision</p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          Fecha de Expiración SOAT
                        </p>
                        <p className="font-semibold">
                          car.fechaExpiracion
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Marca</p>
                        <p className="font-semibold">car.marca</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tipo</p>
                        <p className="font-semibold">car.tipo</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Grupo</p>
                        <p className="font-semibold">car.grupo</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Año</p>
                        <p className="font-semibold">car.año</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Color</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border"
                            // style={{ backgroundColor: car.color }}
                          />
                          <p className="font-semibold">car.color</p>
                        </div>
                      </div>
                    </div>
                    {/* <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        onClick={() => window.open("#", "_blank")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        title="SOAT"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span className="hidden md:inline">SOAT</span>
                      </button>
                      <button
                        onClick={() => window.open("#", "_blank")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        title="CIRCULACIÓN"
                      >
                        <FileWarning className="w-4 h-4" />
                        <span className="hidden md:inline">CIRCULACIÓN</span>
                      </button>
                      <button
                        onClick={() => window.open("#", "_blank")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        title="REVISIÓN"
                      >
                        <FileCog className="w-4 h-4" />
                        <span className="hidden md:inline">REVISIÓN</span>
                      </button>
                      <button
                        onClick={() => window.open("#", "_blank")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        title="DOCUMENTOS"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="hidden md:inline">DOCUMENTOS</span>
                      </button>
                    </div> */}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailDriver;

// import React, { useState, useEffect } from "react";
// import Sidebar from "../../components/layout/Sidebar";
// import MobileToolbar from "../../components/layout/MobileToolbar";
// import { useParams } from "react-router-dom";
// import Loading from "../../components/Loading";
// import {API_BASE_URL} from "../../config/enviroments";
// const defaultImage = "https://via.placeholder.com/640x480.png?text=No+Image";

// const carCard = ({ car }) => (
//   <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
//     <div className="p-4">
//       <h3 className="text-lg font-bold text-blue-800 mb-3">
//         Detalles del Vehículo
//       </h3>
//       <p>
//         <strong>Placa:</strong> {car.plate || "No disponible"}
//       </p>
//       <p>
//         <strong>Chasis:</strong> {car.chassis || "No disponible"}
//       </p>
//       <p>
//         <strong>Motor:</strong> {car.motor || "No disponible"}
//       </p>
//       <p>
//         <strong>SOAT:</strong> {car.number_soat || "No disponible"}
//       </p>
//       <p>
//         <strong>Fecha de Emisión SOAT:</strong>{" "}
//         {car.date_soat_issue || "No disponible"}
//       </p>
//       <p>
//         <strong>Fecha de Expiración SOAT:</strong>{" "}
//         {car.date_soat_expiration || "No disponible"}
//       </p>
//       <p>
//         <strong>Marca:</strong> {car.brand?.name || "No disponible"}
//       </p>
//       <p>
//         <strong>Tipo:</strong> {car.type_car?.name || "No disponible"}
//       </p>
//       <p>
//         <strong>Grupo:</strong> {car.group?.name || "No disponible"}
//       </p>
//       <p>
//         <strong>Año:</strong> {car.year?.name || "No disponible"}
//       </p>
//       <p>
//         <strong>Color:</strong> {car.color?.name || "No disponible"}
//       </p>
//     </div>
//     <div className="grid grid-cols-2 gap-2 p-4">
//       {car.file_soat && (
//         <img
//           src={car.file_soat}
//           alt="SOAT"
//           className="w-full h-40 object-cover rounded-lg"
//           onError={(e) => (e.target.src = defaultImage)}
//         />
//       )}
//       {car.file_car && (
//         <img
//           src={car.file_car}
//           alt="Vehículo"
//           className="w-full h-40 object-cover rounded-lg"
//           onError={(e) => (e.target.src = defaultImage)}
//         />
//       )}
//     </div>
//   </div>
// );

// const DetailDriver = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [driverData, setDriverData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { driverId } = useParams();

//   useEffect(() => {
//     const fetchDriverData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           `${API_BASE_URL}/getDriver/${driverId}?included=cars.brand,cars.typeCar,cars.group,cars.year,cars.color,cars.example`
//         );

//         if (!response.ok) {
//           throw new Error(`Error ${response.status}: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setDriverData(data.data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDriverData();
//   }, [driverId]);

//   if (isLoading) return <Loading />;

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-red-600">Error al cargar la información: {error}</p>
//       </div>
//     );
//   }

//   if (!driverData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-gray-600">
//           No se encontró información del conductor.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex max-h-screen md:min-h-screen">
//       <Sidebar
//         isSidebarOpen={isSidebarOpen}
//         setIsSidebarOpen={setIsSidebarOpen}
//         activeItem="Detail Driver"
//       />

//       <div className="flex-1 overflow-auto">
//         <MobileToolbar
//           setIsSidebarOpen={setIsSidebarOpen}
//           title="Detalle del Conductor"
//         />

//         <main className="p-4 bg-gray-100">
//           <div className="bg-white shadow-md rounded-lg p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-2xl font-bold text-blue-900">
//                 Detalle del Conductor
//               </h1>
//               <button
//                 onClick={() => window.history.back()}
//                 className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
//               >
//                 Volver
//               </button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
//               <div className="p-4 bg-gray-50 rounded-lg shadow">
//                 <h2 className="text-lg font-bold text-gray-700 mb-4">
//                   Información Personal
//                 </h2>
//                 <p>
//                   <strong>Nombre:</strong> {driverData.name || "No disponible"}
//                 </p>
//                 <p>
//                   <strong>Documento:</strong> {driverData.document_type}{" "}
//                   {driverData.document_number}
//                 </p>
//                 <p>
//                   <strong>Teléfono:</strong>{" "}
//                   {driverData.phone_number || "No disponible"}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {driverData.email || "No disponible"}
//                 </p>
//                 <p>
//                   <strong>Dirección:</strong>{" "}
//                   {driverData.address || "No disponible"}
//                 </p>
//                 <p>
//                   <strong>Fecha de Nacimiento:</strong>{" "}
//                   {driverData.birth_date || "No disponible"}
//                 </p>
//                 <p>
//                   <strong>Género:</strong>{" "}
//                   {driverData.gender || "No disponible"}
//                 </p>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg shadow">
//                 <h2 className="text-lg font-bold text-gray-700 mb-4">
//                   Licencia
//                 </h2>
//                 <p>
//                   <strong>Número:</strong>{" "}
//                   {driverData.license_number || "No disponible"}
//                 </p>
//                 <p>
//                   <strong>Fecha de Emisión:</strong>{" "}
//                   {driverData.license_issue_date || "No disponible"}
//                 </p>
//                 <p>
//                   <strong>Fecha de Expiración:</strong>{" "}
//                   {driverData.license_expiration_date || "No disponible"}
//                 </p>
//                 <p>
//                   <strong>Clase:</strong>{" "}
//                   {driverData.license_class || "No disponible"}
//                 </p>
//                 <p>
//                   <strong>Categoría:</strong>{" "}
//                   {driverData.license_category || "No disponible"}
//                 </p>
//                 <img
//                   src={driverData.image_license || defaultImage}
//                   alt="Licencia"
//                   className="w-full h-40 object-cover mt-4 rounded-lg"
//                   onError={(e) => (e.target.src = defaultImage)}
//                 />
//               </div>
//             </div>

//             <div className="mt-8">
//               <h2 className="text-xl font-bold text-gray-700 mb-4">
//                 Vehículos Asociados
//               </h2>
//               {driverData.cars && driverData.cars.length > 0 ? (
//                 driverData.cars.map((car) => (
//                   <carCard key={car.id} car={car} />
//                 ))
//               ) : (
//                 <p className="text-gray-600">No hay vehículos asociados.</p>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DetailDriver;
