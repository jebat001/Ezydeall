import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hasRole } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { z } from "zod";

const schema = z.object({ active: z.boolean().optional(), percentOff: z.number().int().optional(), flatOffCents: z.number().int().optional() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!hasRole((session?.user as any)?.role, "ADMIN")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  await prisma.promotion.update({ where: { id: params.id }, data: parsed.data });
  await audit({ actorId: (session!.user as any).id, action: "admin.promo.update", entity: "Promotion", entityId: params.id, meta: parsed.data });
  return NextResponse.json({ ok: true });
}
