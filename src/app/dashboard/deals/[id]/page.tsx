"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { formatMoney, formatDate } from "@/lib/utils";
import { StatusPill } from "@/components/app/StatusPill";

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [deal, setDeal] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  async function load() {
    const res = await fetch(`/api/deals/${id}`);
    const j = await res.json();
    if (!res.ok) return setErr(j.error || "error");
    setDeal(j.deal);
  }
  useEffect(() => { load(); }, [id]);

  async function action(path: string, body?: any) {
    setBusy(true); setErr(null);
    const res = await fetch(`/api/deals/${id}/${path}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setErr(j.error || "Error");
    await load();
  }

  if (err) return <p className="text-red-400">{err}</p>;
  if (!deal) return <p className="text-white/60">Loading…</p>;

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-white/60 hover:text-white">&larr; Back</button>
      <div className="mt-2 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{deal.title}</h1>
          <p className="text-white/60 mt-1">Created {formatDate(deal.createdAt)}</p>
        </div>
        <StatusPill status={deal.status} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <div className="text-white/60 text-xs uppercase tracking-wider">Amount</div>
          <div className="mt-1 font-display text-2xl font-bold">{formatMoney(deal.amountCents, deal.currency)}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-white/60 text-xs uppercase tracking-wider">Platform fee</div>
          <div className="mt-1 font-display text-2xl font-bold">{formatMoney(deal.feeCents, deal.currency)}</div>
          {deal.promotionCode && <div className="text-xs text-brand-300 mt-1">Promo {deal.promotionCode} applied</div>}
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-white/60 text-xs uppercase tracking-wider">Buyer pays</div>
          <div className="mt-1 font-display text-2xl font-bold">{formatMoney(deal.amountCents + deal.feeCents, deal.currency)}</div>
        </div>
      </div>

      <div className="mt-6 glass rounded-2xl p-6">
        <h3 className="font-display text-lg font-bold">Parties</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm">
          <div><span className="text-white/60">Buyer:</span> {deal.buyer.name || deal.buyer.email}</div>
          <div><span className="text-white/60">Seller:</span> {deal.seller.name || deal.seller.email}</div>
        </div>
        <div className="mt-4 text-sm text-white/70 whitespace-pre-wrap">{deal.description}</div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {deal.status === "AWAITING_PAYMENT" && (
          <Button variant="gold" disabled={busy} onClick={() => action("fund")}>Fund escrow</Button>
        )}
        {deal.status === "FUNDED" && (
          <Button disabled={busy} onClick={() => action("deliver")}>Mark as delivered</Button>
        )}
        {(deal.status === "FUNDED" || deal.status === "DELIVERED" || deal.status === "IN_PROGRESS") && (
          <Button variant="primary" disabled={busy} onClick={() => action("release")}>Release funds</Button>
        )}
        {!deal.dispute && deal.status !== "RELEASED" && deal.status !== "REFUNDED" && (
          <Button variant="secondary" onClick={() => setDisputeOpen(!disputeOpen)}>Open dispute</Button>
        )}
      </div>

      {disputeOpen && (
        <div className="mt-4 glass rounded-2xl p-6">
          <h3 className="font-display font-bold">Open a dispute</h3>
          <p className="text-white/60 text-sm">Tell us what happened. Our team will review within 24–72h.</p>
          <textarea value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} rows={4}
            className="mt-3 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-brand-400" />
          <div className="mt-3 flex gap-2">
            <Button disabled={busy || disputeReason.length < 5} onClick={() => action("dispute", { reason: disputeReason })}>Submit dispute</Button>
            <Button variant="ghost" onClick={() => setDisputeOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {deal.dispute && (
        <div className="mt-6 glass rounded-2xl p-6 border border-red-500/30">
          <h3 className="font-display font-bold text-red-300">Dispute open</h3>
          <p className="text-white/70 mt-1">{deal.dispute.reason}</p>
        </div>
      )}
    </div>
  );
}
