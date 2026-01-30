import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe(z.email("Please enter a valid email address"))
      .transform((val) => val.toLowerCase()),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password cannot exceed 64 characters")
      .regex(/^\S+$/, "Password cannot contain spaces")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must include at least one uppercase letter, one lowercase letter, and one number"
      ),

    confirmPassword: z.string(),

    fullName: z
      .string()
      .trim()
      .max(100, "Full name cannot exceed 100 characters")
      .min(1, "Full name is required")
      .min(2, "Full name is too short")
      .regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿĞğİıŞşÖöÜüÇç\s'-]+$/,
        "Full name can only contain letters, spaces, hyphens (-) and apostrophes (')"
      )
      .transform((val) => val.replace(/\s+/g, " ").trim()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
