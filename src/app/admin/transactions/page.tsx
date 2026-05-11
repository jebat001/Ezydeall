import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/guard";
import { formatMoney, formatDate } from "@/lib/utils";
import Link from "next/link";
import { StatusPill } from "@/components/app/StatusPill";

export default async function TransactionsPage() {
  await requireRole("STAFF");
  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { buyer: true, seller: true }
  });
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Transactions</h1>
      <p className="text-white/60 mt-1">Every deal processed through EzyDeal, across all users.</p>
      <div className="mt-6 glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-white/60 uppercase text-xs tracking-wider">
            <tr><th className="px-4 py-3">Deal</th><th className="px-4 py-3">Buyer</th><th className="px-4 py-3">Seller</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Fee</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th></tr>
          </thead>
          <tbody>
            {deals.map(d => (
              <tr key={d.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3"><Link href={`/dashboard/deals/${d.id}`} className="hover:text-brand-300 font-semibold">{d.title}</Link></td>
                <td className="px-4 py-3 text-white/70">{d.buyer.email}</td>
                <td className="px-4 py-3 text-white/70">{d.seller.email}</td>
                <td className="px-4 py-3">{formatMoney(d.amountCents, d.currency)}</td>
                <td className="px-4 py-3 text-white/70">{formatMoney(d.feeCents, d.currency)}</td>
                <td className="px-4 py-3"><StatusPill status={d.status} /></td>
                <td className="px-4 py-3 text-white/60">{formatDate(d.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
