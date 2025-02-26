import { z } from "zod";

export const brandSchema = z.object({
  name: z
    .string()
    .min(3, "El Nombre debe tener al menos 3 caracteres")
    .max(50, "El Nombre no debe exceder los 50 caracteres"),
});
