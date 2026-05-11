import type { Role } from "@prisma/client";

export const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 1,
  STAFF: 2,
  ADMIN: 3,
  DEVELOPER: 4
};

export function hasRole(userRole: Role | undefined, required: Role) {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[required];
}
