import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { z } from "zod";

const schema = z.object({ reason: z.string().min(5).max(2000) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const deal = await prisma.deal.findUnique({ where: { id: params.id }, include: { dispute: true } });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (deal.buyerId !== userId && deal.sellerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (deal.dispute) return NextResponse.json({ error: "Dispute already open" }, { status: 409 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  await prisma.$transaction([
    prisma.dispute.create({ data: { dealId: deal.id, openedById: userId, reason: parsed.data.reason } }),
    prisma.deal.update({ where: { id: deal.id }, data: { status: "DISPUTED" } })
  ]);
  await audit({ actorId: userId, action: "deal.dispute.open", entity: "Deal", entityId: deal.id });
  return NextResponse.json({ ok: true });
}
