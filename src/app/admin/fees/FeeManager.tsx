"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/utils";

type Tier = { id: string; name: string; minAmountCents: number; maxAmountCents: number; percentBps: number; fixedCents: number; active: boolean };

export function FeeManager({ tiers: initial }: { tiers: Tier[] }) {
  const [tiers, setTiers] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function save(t: Tier) {
    setBusy(true);
    await fetch(`/api/admin/fees/${t.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t)
    });
    setBusy(false);
  }

  function update(id: string, patch: Partial<Tier>) {
    setTiers(tiers.map(t => t.id === id ? { ...t, ...patch } : t));
  }

  return (
    <div className="mt-6 space-y-3">
      {tiers.map(t => (
        <div key={t.id} className="glass rounded-2xl p-5 grid md:grid-cols-6 gap-3 items-end">
          <div>
            <label className="text-xs text-white/60">Name</label>
            <input value={t.name} onChange={(e) => update(t.id, { name: e.target.value })}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 h-10" />
          </div>
          <div>
            <label className="text-xs text-white/60">Min ({formatMoney(t.minAmountCents)})</label>
            <input type="number" value={t.minAmountCents} onChange={(e) => update(t.id, { minAmountCents: +e.target.value })}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 h-10" />
          </div>
          <div>
            <label className="text-xs text-white/60">Max ({formatMoney(t.maxAmountCents)})</label>
            <input type="number" value={t.maxAmountCents} onChange={(e) => update(t.id, { maxAmountCents: +e.target.value })}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 h-10" />
          </div>
          <div>
            <label className="text-xs text-white/60">Percent (bps) — {(t.percentBps / 100).toFixed(2)}%</label>
            <input type="number" value={t.percentBps} onChange={(e) => update(t.id, { percentBps: +e.target.value })}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 h-10" />
          </div>
          <div>
            <label className="text-xs text-white/60">Fixed ¢</label>
            <input type="number" value={t.fixedCents} onChange={(e) => update(t.id, { fixedCents: +e.target.value })}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 h-10" />
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={t.active} onChange={(e) => update(t.id, { active: e.target.checked })} />
              Active
            </label>
            <Button size="sm" disabled={busy} onClick={() => save(t)}>Save</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
