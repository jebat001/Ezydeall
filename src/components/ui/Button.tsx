import { cn } from "@/lib/utils";
import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  as?: "button" | "a";
  href?: string;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  as = "button",
  href,
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-200 will-change-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-400/70 disabled:opacity-60";
  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-14 px-7 text-base"
  };
  const variants: Record<Variant, string> = {
    primary:
      "bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-white shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5",
    secondary:
      "glass text-white hover:bg-white/10",
    ghost:
      "text-white/80 hover:text-white hover:bg-white/5",
    gold:
      "bg-gradient-to-br from-gold-400 to-gold-500 text-ink-950 shadow-[0_0_40px_rgba(245,179,1,0.35)] hover:shadow-[0_0_60px_rgba(245,179,1,0.55)] hover:-translate-y-0.5"
  };
  const cls = cn(base, sizes[size], variants[variant], className);
  if (as === "a" && href) return <a href={href} className={cls}>{children}</a>;
  return <button className={cls} {...rest}>{children}</button>;
}
