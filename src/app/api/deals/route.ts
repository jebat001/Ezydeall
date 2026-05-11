import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { computeFee } from "@/lib/fees";
import { audit } from "@/lib/audit";

const createSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(2000),
  amountCents: z.number().int().positive().max(100_000_000),
  currency: z.string().default("usd"),
  role: z.enum(["BUYER", "SELLER"]),
  counterpartyEmail: z.string().email(),
  inspectionDays: z.number().int().min(1).max(30).default(3),
  promoCode: z.string().optional().nullable()
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const deals = await prisma.deal.findMany({
    where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    orderBy: { createdAt: "desc" },
    include: { buyer: { select: { email: true, name: true } }, seller: { select: { email: true, name: true } } }
  });
  return NextResponse.json({ deals });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { title, description, amountCents, currency, role, counterpartyEmail, inspectionDays, promoCode } = parsed.data;

  // Counterparty must exist or be invited later — for now require existing account.
  const other = await prisma.user.findUnique({ where: { email: counterpartyEmail.toLowerCase() } });
  if (!other) return NextResponse.json({ error: "Counterparty has no EzyDeal account yet." }, { status: 400 });
  if (other.id === userId) return NextResponse.json({ error: "You cannot deal with yourself." }, { status: 400 });

  const buyerId  = role === "BUYER"  ? userId : other.id;
  const sellerId = role === "SELLER" ? userId : other.id;

  const { feeCents, promoApplied } = await computeFee(amountCents, promoCode);

  const deal = await prisma.deal.create({
    data: {
      title, description, amountCents, currency,
      status: "AWAITING_PAYMENT",
      creatorRole: role,
      buyerId, sellerId,
      inspectionDays,
      feeCents,
      promotionCode: promoApplied
    }
  });
  await audit({ actorId: userId, action: "deal.create", entity: "Deal", entityId: deal.id, meta: { amountCents, feeCents } });
  return NextResponse.json({ deal });
}
