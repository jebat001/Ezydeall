import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";
import { hasRole, type Role } from "./rbac";

export async function requireRole(role: Role) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!hasRole((session.user as any).role, role)) redirect("/dashboard");
  return session;
}
