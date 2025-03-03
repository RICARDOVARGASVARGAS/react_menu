import { z } from "zod";

// Conductor
export const driverSchema = z.object({
  document_type: z
    .string()
    .refine((value) => ["dni", "pasaporte"].includes(value), {
      message: "El tipo de documento debe ser 'dni' o 'pasaporte'",
    }),
  document_number: z
    .string()
    .length(8, "El Documento debe tener exactamente 8 caracteres")
    .regex(/^\d+$/, "El Documento debe contener solo números"),
  name: z
    .string()
    .min(3, "El Nombre debe tener al menos 3 caracteres")
    .max(50, "El Nombre no debe exceder los 50 caracteres"),
  first_name: z
    .string()
    .min(3, "El Apellido Paterno debe tener al menos 3 caracteres")
    .max(50, "El Apellido Paterno no debe exceder los 50 caracteres"),
  last_name: z
    .string()
    .min(3, "El Apellido Materno debe tener al menos 3 caracteres")
    .max(50, "El Apellido Materno no debe exceder los 50 caracteres"),
  birth_date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "La Fecha de Nacimiento debe tener el formato YYYY-MM-DD"
    ),
  email: z
    .string()
    .email("El correo no es válido") // Validación de correo primero
    .min(3, "El correo debe tener al menos 3 caracteres")
    .max(50, "El correo no debe exceder los 50 caracteres")
    .nullable() // Permitir null después de las validaciones
    .optional(), // Opcional (puede estar ausente)
  phone_number: z
    .string()
    .regex(/^\d+$/, "El teléfono debe contener solo números") // Validación de números primero
    .min(9, "El teléfono debe tener al menos 9 caracteres")
    .max(20, "El teléfono no debe exceder los 20 caracteres")
    .nullable() // Permitir null después de las validaciones
    .optional(), // Opcional (puede estar ausente)
  address: z
    .string()
    .min(3, "La Dirección debe tener al menos 3 caracteres")
    .max(50, "La Dirección no debe exceder los 50 caracteres")
    .nullable() // Permitir null después de las validaciones
    .optional(), // Opcional (puede estar ausente)
  gender: z.string().refine((value) => ["m", "f"].includes(value), {
    message: "El género debe ser 'm' o 'f'",
  }),
});
