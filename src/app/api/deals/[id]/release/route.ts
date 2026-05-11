import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe, STRIPE_ENABLED } from "@/lib/stripe";
import { audit } from "@/lib/audit";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const deal = await prisma.deal.findUnique({ where: { id: params.id } });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (deal.buyerId !== userId) return NextResponse.json({ error: "Only the buyer can release funds" }, { status: 403 });
  if (deal.status !== "FUNDED" && deal.status !== "DELIVERED" && deal.status !== "IN_PROGRESS") {
    return NextResponse.json({ error: `Cannot release in status ${deal.status}` }, { status: 400 });
  }

  if (STRIPE_ENABLED && deal.paymentIntentId && !deal.paymentIntentId.startsWith("sim_")) {
    const captured = await stripe.paymentIntents.capture(deal.paymentIntentId);
    await prisma.deal.update({
      where: { id: deal.id },
      data: { status: "RELEASED", releasedAt: new Date(), chargeId: (captured.latest_charge as string) || null }
    });
  } else {
    await prisma.deal.update({ where: { id: deal.id }, data: { status: "RELEASED", releasedAt: new Date() } });
  }

  await audit({ actorId: userId, action: "deal.release", entity: "Deal", entityId: deal.id });
  return NextResponse.json({ ok: true });
}
