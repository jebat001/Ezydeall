import { NextResponse } from "next/server";
import { stripe, STRIPE_ENABLED } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!STRIPE_ENABLED) return NextResponse.json({ ok: true, note: "stripe disabled" });
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e: any) {
    return NextResponse.json({ error: `Invalid signature: ${e.message}` }, { status: 400 });
  }

  if (event.type === "payment_intent.amount_capturable_updated" || event.type === "payment_intent.succeeded") {
    const pi = event.data.object as any;
    const dealId = pi.metadata?.dealId;
    if (dealId) {
      await prisma.deal.update({
        where: { id: dealId },
        data: { status: event.type === "payment_intent.succeeded" ? "RELEASED" : "FUNDED", fundedAt: new Date() }
      });
      await audit({ action: `stripe.${event.type}`, entity: "Deal", entityId: dealId });
    }
  }
  return NextResponse.json({ received: true });
}
