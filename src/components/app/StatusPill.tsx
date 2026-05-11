export function StatusPill({ status }: { status: string }) {
  const color: Record<string, string> = {
    DRAFT: "bg-white/10 text-white/70",
    AWAITING_PAYMENT: "bg-gold-500/20 text-gold-400",
    FUNDED: "bg-brand-500/20 text-brand-300",
    IN_PROGRESS: "bg-brand-500/20 text-brand-300",
    DELIVERED: "bg-purple-500/20 text-purple-300",
    RELEASED: "bg-emerald-500/20 text-emerald-300",
    DISPUTED: "bg-red-500/20 text-red-300",
    REFUNDED: "bg-white/10 text-white/60",
    CANCELLED: "bg-white/10 text-white/60"
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color[status] ?? "bg-white/10"}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
