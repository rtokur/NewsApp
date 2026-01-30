import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .pipe(z.email("Invalid email format"))
    .transform((val) => val.toLowerCase().trim()),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
