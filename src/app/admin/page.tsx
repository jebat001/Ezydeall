import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { CircleDollarSign, Handshake, Users, AlertTriangle } from "lucide-react";

export default async function AdminHome() {
  const [users, deals, volume, disputes] = await Promise.all([
    prisma.user.count(),
    prisma.deal.count(),
    prisma.deal.aggregate({ where: { status: "RELEASED" }, _sum: { amountCents: true, feeCents: true } }),
    prisma.dispute.count({ where: { resolved: false } })
  ]);
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Operations center</h1>
      <p className="text-white/60 mt-1">Everything running through EzyDeal, in real time.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Users"  value={String(users)}  icon={Users} />
        <Stat label="Deals"  value={String(deals)}  icon={Handshake} />
        <Stat label="Volume settled" value={formatMoney(volume._sum.amountCents ?? 0)} icon={CircleDollarSign} />
        <Stat label="Open disputes" value={String(disputes)} icon={AlertTriangle} accent="red" />
      </div>

      <div className="mt-8 glass rounded-2xl p-6">
        <h3 className="font-display text-xl font-bold">Revenue from fees</h3>
        <p className="mt-1 text-white/60">Lifetime platform fees collected from released deals.</p>
        <div className="mt-4 font-display text-5xl font-black text-gradient">
          {formatMoney(volume._sum.feeCents ?? 0)}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, accent }: { label: string; value: string; icon: any; accent?: "red" }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${accent === "red" ? "bg-red-500/20" : "bg-gradient-to-br from-brand-400 to-brand-700"}`}>
          <Icon className={`h-5 w-5 ${accent === "red" ? "text-red-300" : "text-white"}`} />
        </div>
        <div>
          <div className="text-white/60 text-sm">{label}</div>
          <div className="font-display text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}
