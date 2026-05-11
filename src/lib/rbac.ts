export type Role = "USER" | "STAFF" | "ADMIN" | "DEVELOPER";

export const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 1,
  STAFF: 2,
  ADMIN: 3,
  DEVELOPER: 4
};

export function hasRole(userRole: string | undefined | null, required: Role) {
  if (!userRole) return false;
  const level = ROLE_HIERARCHY[userRole as Role];
  if (level === undefined) return false;
  return level >= ROLE_HIERARCHY[required];
}
