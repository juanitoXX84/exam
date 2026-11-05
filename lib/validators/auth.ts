import { z } from "zod";
import { INPUT_LIMITS } from "@/lib/validators/limits";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(
      INPUT_LIMITS.nameMax,
      `El nombre no puede superar ${INPUT_LIMITS.nameMax} caracteres.`,
    ),
  email: z
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido.")
    .max(255)
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(
      INPUT_LIMITS.passwordMin,
      `La contraseña debe tener al menos ${INPUT_LIMITS.passwordMin} caracteres.`,
    )
    .max(
      INPUT_LIMITS.passwordMax,
      `La contraseña no puede superar ${INPUT_LIMITS.passwordMax} caracteres.`,
    )
    .regex(/[A-Za-z]/, "La contraseña debe incluir al menos una letra.")
    .regex(/[0-9]/, "La contraseña debe incluir al menos un número."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido.")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const profileNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(
      INPUT_LIMITS.nameMax,
      `El nombre no puede superar ${INPUT_LIMITS.nameMax} caracteres.`,
    ),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria."),
    newPassword: z
      .string()
      .min(
        INPUT_LIMITS.passwordMin,
        `La contraseña debe tener al menos ${INPUT_LIMITS.passwordMin} caracteres.`,
      )
      .max(
        INPUT_LIMITS.passwordMax,
        `La contraseña no puede superar ${INPUT_LIMITS.passwordMax} caracteres.`,
      )
      .regex(/[A-Za-z]/, "La contraseña debe incluir al menos una letra.")
      .regex(/[0-9]/, "La contraseña debe incluir al menos un número."),
    confirmPassword: z.string().min(1, "Confirma la nueva contraseña."),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type ProfileNameInput = z.infer<typeof profileNameSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
