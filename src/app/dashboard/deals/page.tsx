import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatMoney, formatDate } from "@/lib/utils";
import { StatusPill } from "@/components/app/StatusPill";
import { Button } from "@/components/ui/Button";

export default async function DealsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string;
  const deals = await prisma.deal.findMany({
    where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    orderBy: { createdAt: "desc" },
    include: { buyer: true, seller: true }
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">My deals</h1>
        <Button as="a" href="/dashboard/deals/new" variant="gold">New deal</Button>
      </div>
      <div className="mt-6 glass rounded-2xl overflow-hidden">
        {deals.length === 0 ? (
          <div className="p-10 text-center text-white/60">Nothing here yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-white/60 uppercase text-xs tracking-wider">
              <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Counterparty</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Fee</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th></tr>
            </thead>
            <tbody>
              {deals.map((d) => {
                const youAreBuyer = d.buyerId === userId;
                const counter = youAreBuyer ? d.seller : d.buyer;
                return (
                  <tr key={d.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3"><Link href={`/dashboard/deals/${d.id}`} className="font-semibold hover:text-brand-300">{d.title}</Link></td>
                    <td className="px-4 py-3 text-white/70">{youAreBuyer ? "Buyer" : "Seller"}</td>
                    <td className="px-4 py-3 text-white/70">{counter.name || counter.email}</td>
                    <td className="px-4 py-3">{formatMoney(d.amountCents, d.currency)}</td>
                    <td className="px-4 py-3 text-white/70">{formatMoney(d.feeCents, d.currency)}</td>
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
