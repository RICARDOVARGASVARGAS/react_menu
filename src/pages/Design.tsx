import React from "react";

const LicenseCard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gradient-to-br from-green-100 via-white to-blue-100 rounded-lg shadow-xl overflow-hidden relative">
        {/* Header Section */}
        <div
          className="relative flex items-center justify-between p-4"
          style={{
            background:
              "linear-gradient(135deg, #00bfff 33%, #ff8c00 33%, #ff8c00 66%, #008000 66%)",
          }}
        >
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="Municipalidad Logo"
              className="h-28 w-auto"
            />
          </div>

          {/* Text Section */}
          <div className="flex-grow text-center bg-white/80 p-4 rounded shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
              MUNICIPALIDAD DISTRITAL DE ANCO HUALLO
            </h1>
            <h2 className="text-sm font-medium text-gray-700 mt-1">
              UNIDAD DE TRÁNSITO Y CIRCULACIÓN VIAL
            </h2>
            <div className="mt-2 bg-blue-900 text-white py-1 px-4 rounded">
              <h3 className="text-sm font-bold">
                TARJETA ÚNICA DE CIRCULACIÓN
              </h3>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="px-8 py-6 grid grid-cols-2 gap-x-8 gap-y-6 relative bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/fondo.png')",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/80 z-0"></div>

          {/* Left Column */}
          <div className="space-y-4 relative z-10">
            <div className="p-4 bg-white shadow-md rounded-lg">
              <label className="font-bold text-gray-600">NOMBRE O RAZÓN:</label>
              <div className="mt-1 text-gray-800 font-bold">
                WILLIAM QUISPE PILLACA
              </div>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <label className="font-bold text-gray-600">PLACA:</label>
              <div className="mt-1 text-gray-800 font-bold">3088-MA</div>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <label className="font-bold text-gray-600">
                AÑO DE FABRICACIÓN:
              </label>
              <div className="mt-1 text-gray-800 font-bold">2018</div>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <label className="font-bold text-gray-600">N° MOTOR:</label>
              <div className="mt-1 text-gray-800 font-bold">AZNJM59517</div>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <label className="font-bold text-gray-600">EMISIÓN:</label>
              <div className="mt-1 text-gray-800 font-bold">12/07/2024</div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 relative z-10">
            <div className="p-4 bg-white shadow-md rounded-lg">
              <label className="font-bold text-gray-600">CÓDIGO:</label>
              <div className="mt-1 text-gray-800 font-bold">77</div>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <label className="font-bold text-gray-600">CLASE:</label>
              <div className="mt-1 text-gray-800 font-bold">Mototaxi</div>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <label className="font-bold text-gray-600">MARCA:</label>
              <div className="mt-1 text-gray-800 font-bold">BAJAJ</div>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <label className="font-bold text-gray-600">COLOR:</label>
              <div className="mt-1 text-gray-800 font-bold">ROJO</div>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <label className="font-bold text-gray-600">CADUCA:</label>
              <div className="mt-1 text-gray-800 font-bold">12/07/2025</div>
            </div>
          </div>

          {/* Vehicle Image */}
          <div className="absolute z-50 right-8 top-1/2 transform -translate-y-1/2">
            <img
              src="/images/moto.png"
              alt="Mototaxi"
              className="w-48 h-auto opacity-80"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-4"
          style={{
            background:
              "linear-gradient(135deg, #00bfff 33%, #ff8c00 33%, #ff8c00 66%, #008000 66%)",
          }}
        >
          <div className="flex justify-center items-center">
            <span className="font-bold text-white">RUTAS AUTORIZADAS:</span>
            <span className="ml-2 font-semibold text-white">
              A TODOS LOS CENTROS POBLADOS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LicenseCard;
