import { z } from "zod";

// Role
export const roleSchema = z.object({
  name: z
    .string()
    .min(3, "El Rol debe tener al menos 3 caracteres")
    .max(50, "El Rol no debe exceder los 50 caracteres"),
});
