// useToastHook.js
import { toast } from "react-toastify";

export const useToastHook = () => {
  const showToast = (
    message,
    type = "info",
    duration = 1000,
    position = "top-center"
  ) => {
    const options = {
      position: position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "warning":
        toast.warning(message, options);
        break;
      case "info":
      default:
        toast.info(message, options);
        break;
    }
  };

  return { showToast };
};
