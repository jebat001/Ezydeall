"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function NewDealPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", description: "", amount: "", currency: "usd",
    role: "BUYER", counterpartyEmail: "", inspectionDays: 3, promoCode: ""
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const res = await fetch("/api/deals", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        amountCents: Math.round(parseFloat(form.amount) * 100),
        currency: form.currency,
        role: form.role,
        counterpartyEmail: form.counterpartyEmail,
        inspectionDays: Number(form.inspectionDays),
        promoCode: form.promoCode || null
      })
    });
    const j = await res.json();
    setLoading(false);
    if (!res.ok) return setErr(j.error || "Error");
    router.push(`/dashboard/deals/${j.deal.id}`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold">Create a secure deal</h1>
      <p className="text-white/60 mt-1">Funds stay in escrow until both sides are happy.</p>

      <form onSubmit={submit} className="mt-8 glass rounded-2xl p-6 space-y-4">
        <Field label="Deal title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Rolex Submariner purchase" required />
        <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="What's being exchanged, delivery terms, etc." required textarea />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Amount" type="number" step="0.01" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} placeholder="9500.00" required />
          <Field label="Currency" value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} placeholder="usd" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70">You are the...</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 h-11 outline-none focus:border-brand-400">
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
            </select>
          </div>
          <Field label="Inspection days" type="number" value={String(form.inspectionDays)} onChange={(v) => setForm({ ...form, inspectionDays: Number(v) as any })} />
        </div>
        <Field label="Counterparty email" type="email" value={form.counterpartyEmail} onChange={(v) => setForm({ ...form, counterpartyEmail: v })} required />
        <Field label="Promo code (optional)" value={form.promoCode} onChange={(v) => setForm({ ...form, promoCode: v })} placeholder="WELCOME25" />

        {err && <p className="text-red-400 text-sm">{err}</p>}
        <Button type="submit" variant="gold" size="lg" disabled={loading}>{loading ? "Creating…" : "Create deal"}</Button>
      </form>
    </div>
  );
}

function Field(props: { label: string; value: string; onChange: (v: string) => void; type?: string; step?: string; placeholder?: string; required?: boolean; textarea?: boolean; }) {
  return (
    <div>
      <label className="text-sm text-white/70">{props.label}</label>
      {props.textarea ? (
        <textarea value={props.value} onChange={(e) => props.onChange(e.target.value)} rows={3} required={props.required}
          className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-brand-400" />
      ) : (
        <input type={props.type || "text"} step={props.step} value={props.value} onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder} required={props.required}
          className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 h-11 outline-none focus:border-brand-400" />
      )}
    </div>
  );
}
