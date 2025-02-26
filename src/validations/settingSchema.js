import { z } from "zod";

// Brand
export const brandSchema = z.object({
  name: z
    .string()
    .min(3, "La Marca debe tener al menos 3 caracteres")
    .max(50, "La Marca no debe exceder los 50 caracteres"),
});

// Example
export const exampleSchema = z.object({
  name: z
    .string()
    .min(3, "El Modelo debe tener al menos 3 caracteres")
    .max(50, "El Modelo no debe exceder los 50 caracteres"),
});

// Year
export const yearSchema = z.object({
  name: z
    .string()
    .min(4, "El Año debe tener al menos 4 caracteres")
    .max(4, "El Año no debe exceder los 4 caracteres"),
});

// Type
export const typeSchema = z.object({
  name: z
    .string()
    .min(3, "El Tipo debe tener al menos 3 caracteres")
    .max(50, "El Tipo no debe exceder los 50 caracteres"),
});

// Group
export const groupSchema = z.object({
  name: z
    .string()
    .min(3, "El Grupo debe tener al menos 3 caracteres")
    .max(50, "El Grupo no debe exceder los 50 caracteres"),
});

// Color
export const colorSchema = z.object({
  name: z
    .string()
    .min(3, "El Color debe tener al menos 3 caracteres")
    .max(50, "El Color no debe exceder los 50 caracteres"),
  hex: z.string().min(1, "El HEX es requerido"),
});
