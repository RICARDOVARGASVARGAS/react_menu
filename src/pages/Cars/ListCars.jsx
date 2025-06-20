import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import axios from "axios";
import {
  FaSearch,
  FaEraser,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaDownload,
} from "react-icons/fa";
import { apiGet } from "../../services/apiService";
import { useAuth } from "../../hooks/AuthContext";
import ProtectedComponent from "../../components/ProtectedComponent";

const ListCars = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const fetchItems = async () => {
    setIsLoading(true);
    const { data, meta, message } = await apiGet("getCars", {
      page: currentPage,
      perPage: itemsPerPage,
      sort: "desc",
      search: searchQuery,
      included:
        "brand,typeCar,group,year,color,example,latestInspection,latestInsurance,latestPermit,driver.latestLicense",
    });
    setData(data);
    setTotalPages(meta.last_page);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Consumir API para descargar reporte
  // const fetchDataToReport = async () => {
  //   setIsLoading(true);

  //   try {
  //     const { data } = await apiGet("getCars", {
  //       page: 1,
  //       perPage: "all",
  //       sort: "desc",
  //       included:
  //         "brand,typeCar,group,year,color,example,latestInspection,latestInsurance,latestPermit,driver.latestLicense",
  //     });

  //     const transformedData = data.map((item) => {
  //       const statusMessages = [];

  //       if (!item.latest_inspection?.status) {
  //         statusMessages.push("• FALTA REVISIÓN TÉCNICA");
  //       }
  //       if (!item.latest_insurance?.status) {
  //         statusMessages.push("• FALTA SOAT");
  //       }
  //       if (!item.latest_permit?.status) {
  //         statusMessages.push("• FALTA CIRCULACIÓN");
  //       }
  //       if (!item.driver?.latest_license?.status) {
  //         statusMessages.push("• FALTA LICENCIA");
  //       }

  //       const status =
  //         statusMessages.length > 0 ? statusMessages.join("\n") : "✔️ ACTIVO";

  //       return {
  //         id: item.id,
  //         type: item.driver?.document_type?.toUpperCase() ?? "",
  //         document: item.driver?.document_number ?? "",
  //         driver: `${item.driver?.name ?? ""} ${
  //           item.driver?.first_name ?? ""
  //         } ${item.driver?.last_name ?? ""}`,
  //         date_born: item.driver?.birth_date ?? "",
  //         phone: item.driver?.phone_number ?? "",
  //         plate: item.plate ?? "",
  //         brand: item.brand?.name ?? "",
  //         model: item.example?.name ?? "",
  //         year: item.year_id ?? "",
  //         color: item.color?.name ?? "",
  //         group: item.group?.name ?? "",
  //         status: status,
  //       };
  //     });

  //     // Enviar al backend
  //     const response = await apiPost(
  //       "http://localhost:3000/api/reports/download",
  //       transformedData,
  //       {
  //         responseType: "blob", // para descargar
  //       }
  //     );

  //     // Descargar el archivo
  //     const blob = new Blob([response], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "ReporteVehiculos.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //   } catch (error) {
  //     console.error("Error al generar el reporte:", error);
  //   }

  //   setIsLoading(false);
  // };

  const downloadReport = async () => {
    try {
      setIsLoading(true);

      const { data } = await apiGet("getCars", {
        page: 1,
        perPage: "all",
        sort: "desc",
        included:
          "brand,typeCar,group,year,color,example,latestInspection,latestInsurance,latestPermit,driver.latestLicense",
      });

      const transformedData = data.map((item) => {
        const statusMessages = [];

        if (!item.latest_inspection?.status) {
          statusMessages.push("• FALTA REVISIÓN TÉCNICA");
        }
        if (!item.latest_insurance?.status) {
          statusMessages.push("• FALTA SOAT");
        }
        if (!item.latest_permit?.status) {
          statusMessages.push("• FALTA CIRCULACIÓN");
        }
        if (!item.driver?.latest_license?.status) {
          statusMessages.push("• FALTA LICENCIA");
        }

        const status =
          statusMessages.length > 0 ? statusMessages.join("\n") : "✅ ACTIVO";

        return {
          id: item.id,
          type: item.driver?.document_type?.toUpperCase() ?? "",
          document: item.driver?.document_number ?? "",
          driver: `${item.driver?.name ?? ""} ${
            item.driver?.first_name ?? ""
          } ${item.driver?.last_name ?? ""}`,
          date_born: item.driver?.birth_date ?? "",
          phone: item.driver?.phone_number ?? "",
          plate: item.plate ?? "",
          brand: item.brand?.name ?? "",
          model: item.example?.name ?? "",
          year: item.year_id ?? "",
          color: item.color?.name ?? "",
          group: item.group?.name ?? "",
          status,
        };
      });

      console.log(transformedData);

      // Enviar al backend y recibir el archivo
      const response = await axios.post(
        "http://localhost:3000/api/reports/download",
        transformedData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ReporteVehiculos.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al generar el reporte:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = (car) => {
    const inspectionStatus = car.latest_inspection?.status;
    const insuranceStatus = car.latest_insurance?.status;
    const permitStatus = car.latest_permit?.status;
    const licenseStatus = car.driver?.latest_license?.status;

    const allActive =
      inspectionStatus && insuranceStatus && permitStatus && licenseStatus;

    if (allActive) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <FaCheckCircle />
          <span>ACTIVO</span>
        </div>
      );
    }

    const inactiveFields = [];
    if (!inspectionStatus) inactiveFields.push("Revisión");
    if (!insuranceStatus) inactiveFields.push("SOAT");
    if (!permitStatus) inactiveFields.push("Circulación");
    if (!licenseStatus) inactiveFields.push("Licencia");

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-red-600">
          <FaExclamationTriangle />
          <span>INACTIVO</span>
        </div>
        <div className="text-sm text-gray-700">
          {inactiveFields.map((field, index) => (
            <div key={index} className="flex items-center gap-1">
              <FaTimesCircle className="text-red-500" />
              <span>{field}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const actions = [];
  if (user?.permissions?.includes("car.show")) {
    actions.push({
      label: <FaEye />,
      className: "bg-green-500 text-white hover:bg-green-600",
      onClick: (car) => navigate(`/cars/${car.id}/view`),
    });
  }

  return (
    <>
      <div className="flex-1 overflow-auto">
        <main className="p-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">
              Lista de Vehículos
            </h1>
          </div>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ...."
              className="border border-gray-300 rounded px-4 py-2 flex-1"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <FaSearch />
            </button>
            <button
              onClick={downloadReport}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <FaDownload />
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              <FaEraser />
            </button>
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <ProtectedComponent requiredPermissions={"car.index"}>
                <Table
                  headers={[
                    "N°",
                    "Placa",
                    "Marca",
                    "Modelo",
                    "Año",
                    "Color",
                    "Asociación",
                    "Estado",
                    "Operaciones",
                  ]}
                  data={data.map((car, index) => ({
                    id: car.id,
                    plate: car.plate,
                    brand: car.brand?.name,
                    example: car.example?.name,
                    year: car.year?.name,
                    color: car.color?.name,
                    group: car.group?.name,
                    status: getStatusDisplay(car),
                  }))}
                  actions={actions}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </ProtectedComponent>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default ListCars;
