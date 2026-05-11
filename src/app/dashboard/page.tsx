import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatMoney, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CircleDollarSign, Scale } from "lucide-react";
import { StatusPill } from "@/components/app/StatusPill";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string;

  const [active, recent, stats] = await Promise.all([
    prisma.deal.count({ where: { OR: [{ buyerId: userId }, { sellerId: userId }], status: { in: ["AWAITING_PAYMENT","FUNDED","IN_PROGRESS","DELIVERED","DISPUTED"] } } }),
    prisma.deal.findMany({ where: { OR: [{ buyerId: userId }, { sellerId: userId }] }, orderBy: { createdAt: "desc" }, take: 6, include: { buyer: true, seller: true } }),
    prisma.deal.aggregate({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }], status: "RELEASED" },
      _sum: { amountCents: true },
      _count: true
    })
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Welcome back, {session?.user?.name?.split(" ")[0]}</h1>
      <p className="text-white/60 mt-1">Your secure deals at a glance.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard icon={ShieldCheck} label="Active deals" value={active.toString()} />
        <StatCard icon={CircleDollarSign} label="Volume settled" value={formatMoney(stats._sum.amountCents ?? 0)} />
        <StatCard icon={Scale} label="Completed deals" value={String(stats._count)} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Recent deals</h2>
        <Link href="/dashboard/deals/new" className="inline-flex items-center gap-2 text-brand-300 hover:text-brand-200">
          Start a new deal <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 glass rounded-2xl overflow-hidden">
        {recent.length === 0 ? (
          <div className="p-10 text-center text-white/60">No deals yet — <Link href="/dashboard/deals/new" className="text-brand-300">start your first deal</Link>.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-white/60 uppercase text-xs tracking-wider">
              <tr><th className="px-4 py-3">Deal</th><th className="px-4 py-3">Counterparty</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th></tr>
            </thead>
            <tbody>
              {recent.map((d) => {
                const counter = d.buyerId === userId ? d.seller : d.buyer;
                return (
                  <tr key={d.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3"><Link href={`/dashboard/deals/${d.id}`} className="font-semibold hover:text-brand-300">{d.title}</Link></td>
                    <td className="px-4 py-3 text-white/70">{counter.name || counter.email}</td>
                    <td className="px-4 py-3">{formatMoney(d.amountCents, d.currency)}</td>
                    <td className="px-4 py-3"><StatusPill status={d.status} /></td>
                    <td className="px-4 py-3 text-white/60">{formatDate(d.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-white/60 text-sm">{label}</div>
          <div className="font-display text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}


