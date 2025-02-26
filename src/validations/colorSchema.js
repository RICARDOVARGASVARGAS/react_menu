import { z } from "zod";

export const colorSchema = z.object({
  name: z
    .string()
    .min(3, "El Color debe tener al menos 3 caracteres")
    .max(50, "El Color no debe exceder los 50 caracteres"),
  hex: z.string().min(1, "El HEX es requerido"),
});
