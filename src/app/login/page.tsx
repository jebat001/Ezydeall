"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setErr("Invalid email or password");
    else router.push(params.get("callbackUrl") || "/dashboard");
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <label className="text-sm text-white/70">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 h-11 outline-none focus:border-brand-400" />
      </div>
      <div>
        <label className="text-sm text-white/70">Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 h-11 outline-none focus:border-brand-400" />
      </div>
      {err && <p className="text-red-400 text-sm">{err}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-hero-grid flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <img src="/icon.svg" alt="" className="h-9 w-9" />
          <span className="font-display text-2xl font-bold">Ezy<span className="text-gradient">Deal</span></span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-center">Welcome back</h1>
        <p className="text-center text-white/60 mt-1">Sign in to manage your deals</p>
        <Suspense fallback={<div className="mt-6 text-center text-white/60">Loading...</div>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-white/60">
          No account? <Link href="/register" className="text-brand-300 hover:text-brand-200">Create one</Link>
        </p>
      </div>
    </main>
  );
}
