import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe, STRIPE_ENABLED } from "@/lib/stripe";
import { audit } from "@/lib/audit";

/**
 * Fund a deal. If Stripe is configured, creates a PaymentIntent with manual capture
 * (classic escrow pattern — funds are authorized/held until release).
 * If Stripe isn't configured, we simulate funding so the full flow remains demoable.
 */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const deal = await prisma.deal.findUnique({ where: { id: params.id } });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (deal.buyerId !== userId) return NextResponse.json({ error: "Only the buyer can fund" }, { status: 403 });
  if (deal.status !== "AWAITING_PAYMENT") return NextResponse.json({ error: `Cannot fund in status ${deal.status}` }, { status: 400 });

  const total = deal.amountCents + deal.feeCents;

  if (STRIPE_ENABLED) {
    const intent = await stripe.paymentIntents.create({
      amount: total,
      currency: deal.currency,
      capture_method: "manual",
      metadata: { dealId: deal.id, buyerId: deal.buyerId, sellerId: deal.sellerId },
      description: `EzyDeal escrow — ${deal.title}`
    });
    await prisma.deal.update({ where: { id: deal.id }, data: { paymentIntentId: intent.id } });
    await audit({ actorId: userId, action: "deal.fund.init", entity: "Deal", entityId: deal.id, meta: { intent: intent.id } });
    return NextResponse.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id, mode: "stripe" });
  }

  // Simulated funding for demo/dev without Stripe keys.
  const updated = await prisma.deal.update({
    where: { id: deal.id },
    data: { status: "FUNDED", fundedAt: new Date(), paymentIntentId: `sim_${deal.id}` }
  });
  await audit({ actorId: userId, action: "deal.fund.simulated", entity: "Deal", entityId: deal.id });
  return NextResponse.json({ ok: true, mode: "simulated", deal: updated });
}
