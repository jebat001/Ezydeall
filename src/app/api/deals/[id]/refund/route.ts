import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe, STRIPE_ENABLED } from "@/lib/stripe";
import { audit } from "@/lib/audit";
import { hasRole } from "@/lib/rbac";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role;
  if (!hasRole(role, "STAFF")) return NextResponse.json({ error: "Staff only" }, { status: 403 });

  const deal = await prisma.deal.findUnique({ where: { id: params.id } });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (deal.status === "RELEASED" || deal.status === "REFUNDED") {
    return NextResponse.json({ error: `Cannot refund in status ${deal.status}` }, { status: 400 });
  }

  if (STRIPE_ENABLED && deal.paymentIntentId && !deal.paymentIntentId.startsWith("sim_")) {
    try { await stripe.paymentIntents.cancel(deal.paymentIntentId); } catch { /* may already be captured */ }
  }
  await prisma.deal.update({ where: { id: deal.id }, data: { status: "REFUNDED" } });
  await audit({ actorId: (session.user as any).id, action: "deal.refund", entity: "Deal", entityId: deal.id });
  return NextResponse.json({ ok: true });
}
