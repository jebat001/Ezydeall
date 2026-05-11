import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/guard";
import { PromoManager } from "./PromoManager";

export default async function PromoPage() {
  await requireRole("ADMIN");
  const promos = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Promotions</h1>
      <p className="text-white/60 mt-1">Create discount codes that reduce the platform fee on checkout.</p>
      <PromoManager
        promos={promos.map(p => ({
          ...p, createdAt: p.createdAt.toISOString(),
          expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null
        }))}
      />
    </div>
  );
}
