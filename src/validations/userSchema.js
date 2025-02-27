import { z } from "zod";

// Usuario
export const userSchema = z.object({
  document: z
    .string()
    .min(8, "El documento debe tener al menos 8 caracteres")
    .max(8, "El documento no debe exceder los 8 caracteres"),
  name: z
    .string()
    .min(3, "El Nombre debe tener al menos 3 caracteres")
    .max(50, "El Nombre no debe exceder los 50 caracteres"),
  first_name: z
    .string()
    .min(3, "El Apellido debe tener al menos 3 caracteres")
    .max(50, "El Apellido no debe exceder los 50 caracteres"),
  last_name: z
    .string()
    .min(3, "El Apellido debe tener al menos 3 caracteres")
    .max(50, "El Apellido no debe exceder los 50 caracteres"),
  email: z
    .string()
    .email("El correo no es valido")
    .min(3, "El correo debe tener al menos 3 caracteres")
    .max(50, "El correo no debe exceder los 50 caracteres"),
  phone_number: z
    .string()
    .min(8, "El telefono debe tener al menos 8 caracteres")
    .max(8, "El telefono no debe exceder los 8 caracteres"),
});
