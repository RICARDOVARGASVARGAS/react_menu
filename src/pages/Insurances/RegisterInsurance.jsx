import { useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { apiPost } from "../../services/apiService";
import { useToastHook } from "../../hooks/useToastHook";
const RegisterInsurance = ({
  toggleForm,
  setIsLoading,
  cardId,
  fetchItems,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      number_insurance: "",
      issue_date: "",
      expiration_date: "",
      file_insurance: "",
      car_id: cardId,
    },
  });

  const { showToast } = useToastHook();

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    try {
      const response = await apiPost("registerInsurance", formData);
      const { data, message } = response;

      if (data) {
        toggleForm();
        reset();
        fetchItems();
        showToast(message, "success");
      } else {
        showToast(message, "error");
      }
    } catch (error) {
      handleBackendErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <div className="p-4 border-t bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Registrar Nuevo Seguro
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold">N° Soat</label>
              <input
                type="text"
                name="number_insurance"
                autoComplete="off"
                className={`mt-1 p-2 w-full border rounded ${
                  errors.number_insurance ? "border-red-500" : ""
                }`}
                {...register("number_insurance", {
                  required: {
                    value: true,
                    message: "El N° Soat es requerido",
                  },
                  minLength: {
                    value: 3,
                    message: "El N° Soat debe tener al menos 3 caracteres",
                  },
                  maxLength: {
                    value: 20,
                    message: "El N° Soat no debe exceder los 20 caracteres",
                  },
                })}
              />

              {errors.number_insurance && (
                <p className="text-red-500 text-sm">
                  {errors.number_insurance.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Fecha de Emisión
              </label>
              <input
                type="date"
                name="issue_date"
                autoComplete="off"
                className={`mt-1 p-2 w-full border rounded ${
                  errors.issue_date ? "border-red-500" : ""
                }`}
                {...register("issue_date", {
                  required: {
                    value: true,
                    message: "El Fecha de Emisión es requerido",
                  },
                })}
              />

              {errors.issue_date && (
                <p className="text-red-500 text-sm">
                  {errors.issue_date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Fecha de Revalidación
              </label>
              <input
                type="date"
                name="expiration_date"
                autoComplete="off"
                className={`mt-1 p-2 w-full border rounded ${
                  errors.expiration_date ? "border-red-500" : ""
                }`}
                {...register("expiration_date", {
                  required: {
                    value: true,
                    message: "El Fecha de Revalidación es requerido",
                  },
                })}
              />

              {errors.expiration_date && (
                <p className="text-red-500 text-sm">
                  {errors.expiration_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <button
              onClick={toggleForm}
              type="button"
              className="bg-gray-600 text-white py-2 px-6 rounded"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded flex items-center gap-2"
            >
              <FaSave /> Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterInsurance;
