import React, { useState } from "react";
import Loading from "../../components/Loading";
import { FaCheck, FaList, FaSearch, FaEraser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../config/enviroments";

const RegisterDriver = () => {
  const [formData, setFormData] = useState({
    document_type: "dni",
    document_number: "",
    name: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    email: "",
    phone_number: "",
    address: "",
    gender: "M",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSearch = async () => {
    if (!formData.document_number) {
      toast.error("Por favor, ingrese el número de documento.");
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://data-people.codepro-peru.com/api/getPerson/${formData.document_number}`
      );
      const { status, message, information } = await response.json();
      // console.log(information);

      if (!status) {
        setFormData({
          document_type: formData.document_type,
          document_number: formData.document_number,
          name: "",
          first_name: "",
          last_name: "",
          birth_date: "",
          email: "",
          phone_number: "",
          address: "",
          gender: "M",
        });
        toast.error(message);
        return;
      } else {
        setFormData({
          ...formData,
          name: information.names,
          first_name: information.father_last_name,
          last_name: information.mother_last_name,
          birth_date: information.birthday,
        });
      }
    } catch (error) {
      console.error("Error al buscar la persona:", error);
      toast.error("Ocurrió un error al realizar la búsqueda.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/registerDriver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { data, message, errors } = await response.json();

      if (data) {
        toast.success(message);
        navigate("/edit-driver/" + data.id);
      } else {
        console.log(errors);
        toast.error(message);
        setErrors(errors);
      }
    } catch (error) {
      console.error("Error al registrar el conductor:", error);
      toast.error("Ocurrió un error al realizar el registro.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      document_type: "dni",
      document_number: "",
      name: "",
      first_name: "",
      last_name: "",
      birth_date: "",
      email: "",
      phone_number: "",
      address: "",
      gender: "M",
    });
    setErrors({});
  };

  return (
    <>
      <div className="flex-1 overflow-auto">
        <main className="p-1">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Registrar un Nuevo Conductor
          </h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 space-y-4 mx-auto w-full"
          >
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Tipo de Documento
              </label>
              <select
                name="document_type"
                value={formData.document_type}
                onChange={handleChange}
                className={`border ${
                  errors.document_type ? "border-red-500" : "border-gray-300"
                } rounded px-4 py-2 w-full`}
              >
                <option value="dni">DNI</option>
                <option value="passport">Pasaporte</option>
              </select>
              {errors.document_type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.document_type[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Número de Documento
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="document_number"
                  value={formData.document_number}
                  onChange={handleChange}
                  autoComplete="off"
                  className={`border ${
                    errors.document_number
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded px-4 py-2 w-full`}
                  placeholder="Ingrese el número de documento"
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? <Loading size="small" /> : <FaSearch />}
                  Buscar
                </button>
              </div>
              {errors.document_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.document_number[0]}
                </p>
              )}
            </div>

            {[
              { name: "name", label: "Nombres" },
              { name: "first_name", label: "Apellido Paterno" },
              { name: "last_name", label: "Apellido Materno" },
              { name: "birth_date", label: "Fecha de Nacimiento" },
              { name: "email", label: "Correo Electrónico" },
              { name: "phone_number", label: "Número de Teléfono" },
              { name: "address", label: "Dirección" },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block mb-2 text-gray-700 font-medium">
                  {label}
                </label>
                <input
                  type={name === "birth_date" ? "date" : "text"}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`border ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  } rounded px-4 py-2 w-full`}
                  placeholder={`Ingrese ${label.toLowerCase()}`}
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[name][0]}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Género
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`border ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                } rounded px-4 py-2 w-full`}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender[0]}</p>
              )}
            </div>

            <div className="flex justify-between gap-4 mt-6 overflow-x-auto">
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
                  >
                    <FaCheck />
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-400"
                    onClick={() => navigate("/list-drivers")}
                  >
                    <FaList />
                    Lista
                  </button>
                  <button
                    type="button"
                    className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-700"
                    onClick={handleClear}
                  >
                    <FaEraser />
                    Limpiar
                  </button>
                </>
              )}
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default RegisterDriver;
