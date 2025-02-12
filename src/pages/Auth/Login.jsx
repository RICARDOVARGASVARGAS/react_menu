import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { useAuth } from "../../hooks/AuthContext"; // Importa el hook useAuth
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { login } = useAuth();

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    try {
      await login(formData);
      navigate("/"); // Redirección a la página principal
    } catch (error) {
      handleBackendErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex">
      {isLoading && <Loading />}
      {/* Lado izquierdo: Imagen de fondo (solo en desktop) */}
      <div
        className="hidden lg:block flex-1 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://yt3.googleusercontent.com/ytc/AIdro_m2WKqg22Hy2dc6MKK27VFQsJWjetAwibJ54ZJqk5iCE0I=s900-c-k-c0x00ffffff-no-rj')",
        }}
      >
        {/* Puedes agregar un overlay oscuro para mejorar la legibilidad del texto (opcional) */}
        {/* <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Secov</h1>
        </div> */}
      </div>

      {/* Lado derecho: Formulario de login */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-blue-800 mb-2 text-center">
            SECOV
          </h1>
          <h3 className="text-1xl font-bold text-gray-800 mb-6 text-center">
            Sistema de Control Vehicular
          </h3>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Correo Electrónico
              </label>
              <input
                type="text"
                name="username"
                placeholder="Ingresa tu Usuario"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.username ? "border-red-500" : ""
                }`}
                {...register("username", {
                  required: {
                    value: true,
                    message: "El Usuario es requerido",
                  },
                  minLength: {
                    value: 3,
                    message: "El Usuario debe tener al menos 3 caracteres",
                  },
                  maxLength: {
                    value: 50,
                    message: "El Usuario no debe exceder los 50 caracteres",
                  },
                })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password", {
                  required: {
                    value: true,
                    message: "La Contraseña es requerida",
                  },
                  minLength: {
                    value: 3,
                    message: "La Contraseña debe tener al menos 3 caracteres",
                  },
                  maxLength: {
                    value: 30,
                    message: "La Contraseña no debe exceder los 30 caracteres",
                  },
                })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Iniciar Sesión
            </button>
          </form>
          {/* <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Regístrate
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
