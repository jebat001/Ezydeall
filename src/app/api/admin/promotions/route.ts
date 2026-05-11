import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hasRole } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(2).max(32),
  description: z.string().max(200).optional().nullable(),
  percentOff: z.number().int().min(0).max(100),
  flatOffCents: z.number().int().min(0)
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!hasRole((session?.user as any)?.role, "ADMIN")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const promo = await prisma.promotion.create({
    data: {
      code: parsed.data.code.toUpperCase(),
      description: parsed.data.description ?? null,
      percentOff: parsed.data.percentOff,
      flatOffCents: parsed.data.flatOffCents,
      createdById: (session!.user as any).id
    }
  });
  await audit({ actorId: (session!.user as any).id, action: "admin.promo.create", entity: "Promotion", entityId: promo.id });
  return NextResponse.json({ promo: { ...promo, createdAt: promo.createdAt.toISOString(), expiresAt: promo.expiresAt?.toISOString() ?? null } });
}
