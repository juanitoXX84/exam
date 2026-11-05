import { RoleName } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import {
  hasPermission,
  type Permission,
} from "@/lib/rbac/permissions";

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: "UNAUTHENTICATED" | "FORBIDDEN" = "FORBIDDEN",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireSession() {
  const session = await auth();

  if (!session?.user?.id || !session.user.role) {
    throw new AuthError("Debes iniciar sesión.", "UNAUTHENTICATED");
  }

  return session;
}

export async function requireRole(allowedRoles: RoleName[]) {
  const session = await requireSession();

  if (!allowedRoles.includes(session.user.role)) {
    throw new AuthError("No tienes permiso para realizar esta acción.");
  }

  return session;
}

export async function requirePermission(permission: Permission) {
  const session = await requireSession();

  if (!hasPermission(session.user.role, permission)) {
    throw new AuthError("No tienes permiso para realizar esta acción.");
  }

  return session;
}
