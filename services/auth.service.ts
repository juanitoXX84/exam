import { RoleName } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  registerSchema,
  profileNameSchema,
  changePasswordSchema,
  type RegisterInput,
} from "@/lib/validators/auth";
import {
  removeAvatarFiles,
  saveAvatarFile,
} from "@/lib/profile/avatar";

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function registerTourist(
  input: RegisterInput,
): Promise<ServiceResult<{ id: string; email: string }>> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return {
      ok: false,
      error: "Ya existe una cuenta con este correo electrónico.",
      fieldErrors: { email: ["Este correo ya está registrado."] },
    };
  }

  const touristRole = await prisma.role.findUnique({
    where: { name: RoleName.TOURIST },
  });

  if (!touristRole) {
    return {
      ok: false,
      error: "El sistema de roles no está inicializado. Ejecuta el seed.",
    };
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      roleId: touristRole.id,
    },
    select: { id: true, email: true },
  });

  return { ok: true, data: user };
}

export async function getAccountProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, image: true, passwordHash: true },
  });

  if (!user) return null;

  return {
    name: user.name,
    email: user.email,
    image: user.image,
    hasPassword: Boolean(user.passwordHash),
  };
}

export async function updateTouristName(
  userId: string,
  name: string,
): Promise<ServiceResult<{ name: string }>> {
  const parsed = profileNameSchema.safeParse({ name });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa el nombre.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name },
    select: { name: true },
  });

  return { ok: true, data: { name: user.name ?? parsed.data.name } };
}

export async function updateTouristAvatar(
  userId: string,
  file: File,
): Promise<ServiceResult<{ image: string }>> {
  const saved = await saveAvatarFile(userId, file);
  if (!saved.ok) {
    return { ok: false, error: saved.error };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { image: saved.url },
    select: { id: true },
  });

  return { ok: true, data: { image: saved.url } };
}

export async function removeTouristAvatar(
  userId: string,
): Promise<ServiceResult<{ image: null }>> {
  await removeAvatarFiles(userId);
  await prisma.user.update({
    where: { id: userId },
    data: { image: null },
    select: { id: true },
  });

  return { ok: true, data: { image: null } };
}

export async function changeTouristPassword(
  userId: string,
  input: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
): Promise<ServiceResult<{ id: string }>> {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa la contraseña.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, passwordHash: true },
  });

  if (!user?.passwordHash) {
    return { ok: false, error: "Esta cuenta no tiene contraseña para cambiar." };
  }

  const matches = await verifyPassword(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!matches) {
    return {
      ok: false,
      error: "La contraseña actual no es correcta.",
      fieldErrors: { currentPassword: ["La contraseña actual no es correcta."] },
    };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
    select: { id: true },
  });

  return { ok: true, data: { id: user.id } };
}
