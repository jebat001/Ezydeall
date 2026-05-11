"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

type P = { id: string; code: string; description: string | null; percentOff: number; flatOffCents: number; active: boolean; expiresAt: string | null; createdAt: string };

export function PromoManager({ promos: initial }: { promos: P[] }) {
  const [promos, setPromos] = useState(initial);
  const [code, setCode] = useState(""); const [description, setDescription] = useState("");
  const [percentOff, setPercentOff] = useState(25); const [flatOffCents, setFlatOffCents] = useState(0);
  const [busy, setBusy] = useState(false);

  async function add() {
    setBusy(true);
    const res = await fetch("/api/admin/promotions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, description, percentOff, flatOffCents })
    });
    setBusy(false);
    if (res.ok) {
      const j = await res.json();
      setPromos([j.promo, ...promos]);
      setCode(""); setDescription("");
    }
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/admin/promotions/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active })
    });
    setPromos(promos.map(p => p.id === id ? { ...p, active } : p));
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="glass rounded-2xl p-5 grid gap-3 md:grid-cols-5">
        <input placeholder="CODE" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
          className="rounded-lg bg-white/5 border border-white/10 px-3 h-10" />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}
          className="md:col-span-2 rounded-lg bg-white/5 border border-white/10 px-3 h-10" />
        <input type="number" placeholder="% off" value={percentOff} onChange={e => setPercentOff(+e.target.value)}
          className="rounded-lg bg-white/5 border border-white/10 px-3 h-10" />
        <input type="number" placeholder="Flat off (¢)" value={flatOffCents} onChange={e => setFlatOffCents(+e.target.value)}
          className="rounded-lg bg-white/5 border border-white/10 px-3 h-10" />
        <div className="md:col-span-5"><Button disabled={busy || !code} onClick={add}>Create promotion</Button></div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-white/60 uppercase text-xs tracking-wider">
            <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">% off</th><th className="px-4 py-3">Flat off</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th><th /></tr>
          </thead>
          <tbody>
            {promos.map(p => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-mono">{p.code}</td>
                <td className="px-4 py-3">{p.percentOff}%</td>
                <td className="px-4 py-3">{(p.flatOffCents / 100).toFixed(2)}</td>
                <td className="px-4 py-3">{p.active ? <span className="text-emerald-300">Active</span> : <span className="text-white/50">Disabled</span>}</td>
                <td className="px-4 py-3 text-white/60">{formatDate(p.createdAt)}</td>
                <td className="px-4 py-3 text-right"><Button size="sm" variant="secondary" onClick={() => toggle(p.id, !p.active)}>{p.active ? "Disable" : "Enable"}</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
