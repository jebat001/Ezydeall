import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/guard";
import { formatDate } from "@/lib/utils";

export default async function AuditPage() {
  await requireRole("ADMIN");
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 300, include: { actor: { select: { email: true } } } });
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Audit log</h1>
      <p className="text-white/60 mt-1">Immutable trail of every privileged action on EzyDeal.</p>
      <div className="mt-6 glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-white/60 uppercase text-xs tracking-wider">
            <tr><th className="px-4 py-3">When</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th><th className="px-4 py-3">Meta</th></tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-t border-white/5">
                <td className="px-4 py-3 text-white/60">{formatDate(l.createdAt)}</td>
                <td className="px-4 py-3">{l.actor?.email || <span className="text-white/40">system</span>}</td>
                <td className="px-4 py-3 font-mono text-xs">{l.action}</td>
                <td className="px-4 py-3 text-white/70">{l.entity} {l.entityId && <span className="text-white/40">· {l.entityId}</span>}</td>
                <td className="px-4 py-3 text-xs text-white/60 font-mono">{l.meta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
