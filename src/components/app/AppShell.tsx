"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Handshake, Shield, Users, Tag, Receipt, Percent, ScrollText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const path = usePathname();
  const role = (data?.user as any)?.role as string | undefined;

  const userNav = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/deals", label: "My deals", icon: Handshake },
    { href: "/dashboard/deals/new", label: "New deal", icon: Shield }
  ];
  const adminNav = [
    { href: "/admin", label: "Admin", icon: LayoutDashboard },
    { href: "/admin/staff", label: "Staff & roles", icon: Users },
    { href: "/admin/fees", label: "Fees", icon: Percent },
    { href: "/admin/promotions", label: "Promotions", icon: Tag },
    { href: "/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/admin/audit", label: "Audit log", icon: ScrollText }
  ];

  return (
    <div className="min-h-screen bg-hero-grid">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-white/5 glass p-5 hidden md:flex flex-col">
        <Link href="/" className="flex items-center gap-2">
          <img src="/icon.svg" className="h-9 w-9" alt="" />
          <span className="font-display text-xl font-bold">Ezy<span className="text-gradient">Deal</span></span>
        </Link>
        <div className="mt-8 text-[11px] uppercase tracking-widest text-white/40">Workspace</div>
        <nav className="mt-2 flex flex-col gap-1">
          {userNav.map((n) => (
            <Link key={n.href} href={n.href}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/5",
                path === n.href && "bg-white/10 text-white")}>
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>

        {(role === "ADMIN" || role === "DEVELOPER" || role === "STAFF") && (
          <>
            <div className="mt-8 text-[11px] uppercase tracking-widest text-white/40">Operations</div>
            <nav className="mt-2 flex flex-col gap-1">
              {adminNav.map((n) => (
                <Link key={n.href} href={n.href}
                  className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/5",
                    path === n.href && "bg-white/10 text-white")}>
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              ))}
            </nav>
          </>
        )}

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="text-sm">
            <div className="font-semibold">{data?.user?.name || data?.user?.email}</div>
            <div className="text-xs text-white/50">{role}</div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })}
                  className="mt-3 flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
