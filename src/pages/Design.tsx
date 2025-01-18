import React from "react";

const LicenseCard = () => {
  const cards: any = [];

  for (let i = 0; i < 50; i++) {
    cards.push(
      <div className="flex items-center justify-center my-3" key={i}>
        {/* Front Side */}
        <div
          className="w-[8.56cm] h-[5.4cm] flex items-center justify-center p-0.5"
          style={{
            background:
              "linear-gradient(135deg, #00bfff 33%, #ff8c00 33%, #ff8c00 66%, #008000 66%)",
            fontSize: "0.45rem",
          }}
        >
          <div className="w-[8.56cm] h-[5.4cm] rounded-sm shadow-xl overflow-hidden relative">
            {/* Header Section */}
            <div className="relative flex items-center justify-between p-0.5">
              {/* Logo Section */}
              <div className="flex-shrink-0">
                <img
                  src="/images/logo-min.png"
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
              <div className="absolute inset-0 bg-white/90 z-0 rounded-md"></div>

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
            <div className="px-1 py-0.5 h-4 flex justify-center items-center">
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
        {/* Back Side */}
        <div
          className="w-[8.56cm] h-[5.4cm] flex items-center justify-center p-0.5"
          style={{
            background:
              "linear-gradient(135deg, #00bfff 33%, #ff8c00 33%, #ff8c00 66%, #008000 66%)",
            fontSize: "0.45rem",
          }}
        >
          <div className="w-[8.56cm] h-[5.4cm] rounded-sm shadow-xl overflow-hidden relative">
            {/* Header Section */}
            <div className="relative flex items-center justify-between p-0.5">
              {/* Logo Section */}
              <div className="flex-shrink-0">
                <img
                  src="/images/logo-min.png"
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
                    OBLIGACIONES DEL CONDUCTOR
                  </h3>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div
              className="flex flex-row flex-grow px-1 py-1 bg-white/80 p-0.5 rounded shadow-sm space-x-2 mx-2"
              style={{
                backgroundImage: "url('/images/fondo.png')",
                fontSize: "0.35rem",
              }}
            >
              {/* Left: Text content */}
              <div className="flex-1">
                <ul className="list-disc text-[0.4rem] leading-snug text-gray-800 pl-4 space-y-1">
                  <li>
                    Prestará el servicio con vehículos autorizados con la
                    Tarjeta de Circulación.
                  </li>
                  <li>
                    Facilitar la supervisión y fiscalización de los Inspectores
                    de Transporte.
                  </li>
                  <li>
                    Cumplir estrictamente con ruta y demás condiciones
                    establecidas.
                  </li>
                  <li>
                    La Tarjeta de Circulación será decomisada por el Inspector
                    de Transporte cuando se dé uso indebido, tenga borrones o
                    enmendaduras, o no coincida con los datos en el vehículo o
                    esté vencida (Art. 69 del DS.017-2009/MTC).
                  </li>
                  <li>
                    El inspector de Transporte puede retener la Licencia de
                    Conducir (Art. 112) cuando se niegue a dar información o
                    documentos del vehículo que conduce o proporcione
                    información falsa. Por no colaborar o pretender burlar la
                    inspección.
                  </li>
                </ul>
              </div>

              {/* Right: Placeholder for vertical image */}
              <div className="w-[1.5cm] h-full flex flex-col justify-center items-center mt-6 space-y-6">
                <img
                  src="/images/firma.png"
                  alt="Firma"
                  className="w-40 h-auto -rotate-90"
                />
                <img
                  src="/images/qr.png"
                  alt="Qr"
                  className="w-10 h-auto rotate-0"
                />
              </div>
            </div>

            {/* Footer */}
            {/* <div className="px-1 py-0.5 h-4 flex justify-center items-center">
            <div className="flex justify-center items-center">
              <span className="font-bold text-white text-[0.4rem]">
                RUTAS AUTORIZADAS:
              </span>
              <span className="ml-1 font-semibold text-white text-[0.4rem]">
                A TODOS LOS CENTROS POBLADOS
              </span>
            </div>
          </div> */}
          </div>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
    @media print {
      @page {
        margin-top: 0.5cm;
        margin-bottom: 0.5cm;
        margin-left: 1cm;
        margin-right: 1cm;
      }

      body {
        margin: 0;
        padding: 0;
      }

      .flex.items-center.justify-center {
        page-break-inside: avoid;
      }

      .print-button {
        display: none;
      }
    }
  `}
      </style>
      {cards}

      {/* Botón flotante para imprimir */}
      <button
        onClick={handlePrint}
        className="print-button fixed bottom-5 right-5 bg-blue-600 text-white rounded-full shadow-lg p-3 hover:bg-blue-700 transition duration-300 ease-in-out text-sm hidden lg:block"
      >
        Imprimir
      </button>
    </>
  );
};

export default LicenseCard;
