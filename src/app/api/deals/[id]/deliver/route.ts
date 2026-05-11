import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const deal = await prisma.deal.findUnique({ where: { id: params.id } });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (deal.sellerId !== userId) return NextResponse.json({ error: "Only the seller can mark delivered" }, { status: 403 });
  if (deal.status !== "FUNDED" && deal.status !== "IN_PROGRESS") {
    return NextResponse.json({ error: `Cannot deliver in status ${deal.status}` }, { status: 400 });
  }
  await prisma.deal.update({ where: { id: deal.id }, data: { status: "DELIVERED", deliveredAt: new Date() } });
  await audit({ actorId: userId, action: "deal.deliver", entity: "Deal", entityId: deal.id });
  return NextResponse.json({ ok: true });
}
