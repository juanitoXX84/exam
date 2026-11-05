import { RoleName } from "@prisma/client";

/**
 * Permisos de la aplicación.
 */
export const PERMISSIONS = {
  "content:read": "content:read",
  "favorites:manage": "favorites:manage",
  "reviews:create": "reviews:create",
  "reports:create": "reports:create",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const TOURIST_PERMISSIONS: Permission[] = [
  PERMISSIONS["content:read"],
  PERMISSIONS["favorites:manage"],
  PERMISSIONS["reviews:create"],
  PERMISSIONS["reports:create"],
];

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  [RoleName.TOURIST]: TOURIST_PERMISSIONS,
  [RoleName.ESTABLISHMENT]: TOURIST_PERMISSIONS,
  [RoleName.ADMIN]: TOURIST_PERMISSIONS,
};

export function hasPermission(role: RoleName, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: RoleName,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}
