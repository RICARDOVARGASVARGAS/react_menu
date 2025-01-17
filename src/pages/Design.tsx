import React from "react";

const LicenseCard = () => {
  return (
    <div
      className="flex items-center justify-center p-0.5"
      style={{ width: "8.56cm", height: "5.4cm" }}
    >
      <div className="w-full h-full bg-gradient-to-br from-green-100 via-white to-blue-100 rounded-sm shadow-xl overflow-hidden relative">
        {/* Header Section */}
        <div
          className="relative flex items-center justify-between p-0.5"
          style={{
            background:
              "linear-gradient(135deg, #00bfff 33%, #ff8c00 33%, #ff8c00 66%, #008000 66%)",
            fontSize: "0.45rem",
          }}
        >
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="Municipalidad Logo"
              className="w-10 h-auto"
            />
          </div>

          {/* Text Section */}
          <div className="flex-grow text-center bg-white/80 p-0.5 rounded shadow-sm">
            <h1 className="text-[0.45rem] font-bold text-gray-900 tracking-tight leading-tight">
              MUNICIPALIDAD DISTRITAL DE ANCO HUALLO
            </h1>
            <h2 className="text-[0.4rem] font-medium text-gray-700 mt-0.5">
              UNIDAD DE TRÁNSITO Y CIRCULACIÓN VIAL
            </h2>
            <div className="mt-0.5 bg-blue-900 text-white py-0.5 px-1 rounded">
              <h3 className="text-[0.4rem] font-bold">
                TARJETA ÚNICA DE CIRCULACIÓN
              </h3>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="px-1 py-1 grid grid-cols-3 gap-x-2 gap-y-1 relative bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/fondo.png')",
            fontSize: "0.35rem",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/90 z-0"></div>

          {/* First Column */}
          <div className="space-y-0.5 relative z-10">
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                ASOCIACIÓN:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                ANCO HUALLO
              </div>
            </div>
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                PLACA:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                3088-MA
              </div>
            </div>
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                AÑO DE FABRICACIÓN:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                2018
              </div>
            </div>
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                N° MOTOR:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                AZNJM59517
              </div>
            </div>
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                EMISIÓN:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                12/07/2024
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div className="space-y-0.5 relative z-10">
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                PROPIETARIO:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                WILLIAM QUISPE PILLACA
              </div>
            </div>
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                CLASE:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                Mototaxi
              </div>
            </div>
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                MARCA:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                BAJAJ
              </div>
            </div>
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                COLOR:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                ROJO
              </div>
            </div>
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                CADUCA:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                12/07/2025
              </div>
            </div>
          </div>

          {/* Third Column */}
          <div className="space-y-0.5 relative z-10">
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                DOCUMENTO:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                70708525
              </div>
            </div>
            <div className="p-0.5  shadow-md rounded-sm">
              <label className="font-bold text-gray-600 text-[0.35rem]">
                CÓDIGO:
              </label>
              <div className="mt-0.5 text-gray-800 font-bold text-[0.4rem]">
                77
              </div>
            </div>
            <div className="pt-2 flex justify-center items-center">
              <img
                src="/images/moto.png"
                alt="Mototaxi"
                className="w-36 h-auto opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-1 py-0.5 h-4 flex justify-center items-center"
          style={{
            background:
              "linear-gradient(135deg, #00bfff 33%, #ff8c00 33%, #ff8c00 66%, #008000 66%)",
            fontSize: "0.45rem",
          }}
        >
          <div className="flex justify-center items-center">
            <span className="font-bold text-white text-[0.4rem]">
              RUTAS AUTORIZADAS:
            </span>
            <span className="ml-1 font-semibold text-white text-[0.4rem]">
              A TODOS LOS CENTROS POBLADOS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseCard;
