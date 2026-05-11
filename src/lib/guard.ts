import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { hasRole } from "./rbac";

export async function requireRole(role: Role) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!hasRole((session!.user as any).role, role)) redirect("/dashboard");
  return session!;
}
