"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 flex w-[95%] max-w-7xl items-center justify-between rounded-2xl glass px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/icon.svg" alt="EzyDeal" className="h-8 w-8" />
          <span className="font-display text-xl font-bold tracking-tight">
            Ezy<span className="text-gradient">Deal</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/75">
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#trust" className="hover:text-white">Trust</a>
        </nav>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Button as="a" href="/dashboard" variant="secondary" size="sm">Dashboard</Button>
              <Button size="sm" variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</Button>
            </>
          ) : (
            <>
              <Button as="a" href="/login" variant="ghost" size="sm">Sign in</Button>
              <Button as="a" href="/register" size="sm">Get started</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
