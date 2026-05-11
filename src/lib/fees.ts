import { prisma } from "./db";

/**
 * Compute platform fee in cents for a given amount.
 * Uses active fee tiers from DB; falls back to 2.9% + 30¢.
 */
export async function computeFee(amountCents: number, promoCode?: string | null) {
  const tier = await prisma.feeTier.findFirst({
    where: {
      active: true,
      minAmountCents: { lte: amountCents },
      maxAmountCents: { gte: amountCents }
    },
    orderBy: { minAmountCents: "asc" }
  });

  let fee = tier
    ? Math.round((amountCents * tier.percentBps) / 10000) + tier.fixedCents
    : Math.round(amountCents * 0.029) + 30;

  let promoApplied: string | null = null;
  if (promoCode) {
    const promo = await prisma.promotion.findUnique({ where: { code: promoCode.toUpperCase() } });
    if (promo && promo.active && (!promo.expiresAt || promo.expiresAt > new Date())) {
      if (promo.percentOff) fee = Math.round(fee * (100 - promo.percentOff) / 100);
      if (promo.flatOffCents) fee = Math.max(0, fee - promo.flatOffCents);
      promoApplied = promo.code;
    }
  }

  return { feeCents: fee, tierName: tier?.name ?? "default", promoApplied };
}
