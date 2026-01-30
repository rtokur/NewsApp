import { string, z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .max(254, "Email is too long")
    .pipe(z.email("Invalid email format"))
    .transform((val) => val.toLowerCase().trim()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters"),

  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
