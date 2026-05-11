import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hasRole } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { z } from "zod";

const schema = z.object({ role: z.enum(["USER", "STAFF", "ADMIN", "DEVELOPER"]) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const actorRole = (session.user as any).role;
  if (!hasRole(actorRole, "ADMIN")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  // Only DEVELOPER can create/modify DEVELOPER/ADMIN
  if ((parsed.data.role === "DEVELOPER" || parsed.data.role === "ADMIN") && actorRole !== "DEVELOPER") {
    return NextResponse.json({ error: "Only DEVELOPER can assign ADMIN/DEVELOPER roles" }, { status: 403 });
  }

  const user = await prisma.user.update({ where: { id: params.id }, data: { role: parsed.data.role } });
  await audit({ actorId: (session.user as any).id, action: "admin.user.role", entity: "User", entityId: user.id, meta: { role: parsed.data.role } });
  return NextResponse.json({ ok: true });
}
