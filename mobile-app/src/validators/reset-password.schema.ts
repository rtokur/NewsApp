import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(1, { message: "Token is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password must be at most 64 characters" })
      .regex(/^\S+$/, {
        message: "Password cannot contain spaces",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter and one number",
      }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;