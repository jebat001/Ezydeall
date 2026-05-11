import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/guard";
import { FeeManager } from "./FeeManager";

export default async function FeesPage() {
  await requireRole("ADMIN");
  const tiers = await prisma.feeTier.findMany({ orderBy: { minAmountCents: "asc" } });
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Fee tiers</h1>
      <p className="text-white/60 mt-1">Control platform fees by amount band. Changes take effect instantly.</p>
      <FeeManager tiers={tiers.map(t => ({ ...t, createdAt: t.createdAt.toISOString(), updatedAt: t.updatedAt.toISOString() }))} />
    </div>
  );
}
