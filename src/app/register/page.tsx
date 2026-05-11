"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const res = await fetch("/api/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Something went wrong"); setLoading(false); return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-hero-grid flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <img src="/icon.svg" alt="" className="h-9 w-9" />
          <span className="font-display text-2xl font-bold">Ezy<span className="text-gradient">Deal</span></span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-center">Create your account</h1>
        <p className="text-center text-white/60 mt-1">Free. 60 seconds. No card required.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/70">Full name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 h-11 outline-none focus:border-brand-400" />
          </div>
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 h-11 outline-none focus:border-brand-400" />
          </div>
          <div>
            <label className="text-sm text-white/70">Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 h-11 outline-none focus:border-brand-400" />
            <p className="mt-1 text-xs text-white/50">At least 8 characters.</p>
          </div>
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <Button type="submit" variant="gold" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account? <Link href="/login" className="text-brand-300 hover:text-brand-200">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
