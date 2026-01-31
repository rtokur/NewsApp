import { z } from "zod";

export const changeEmailSchema = z
  .object({
    newEmail: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .toLowerCase()
      .trim(),
    confirmEmail: z
      .string()
      .min(1, "Please confirm your new email")
      .email("Please enter a valid email address")
      .toLowerCase()
      .trim(),
    currentPassword: z
      .string()
      .min(1, "Current password is required for security"),
  })
  .refine((data) => data.newEmail === data.confirmEmail, {
    message: "Email addresses do not match",
    path: ["confirmEmail"],
  });

export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;