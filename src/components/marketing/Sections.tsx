"use client";
import { Reveal } from "./Reveal";
import { ShieldCheck, Lock, Banknote, Scale, Sparkles, Globe, Zap, BadgeCheck } from "lucide-react";

export function Features() {
  const items = [
    { icon: ShieldCheck, title: "Bank-grade Escrow", desc: "Funds are held in a segregated, regulated account until delivery is confirmed. Zero counterparty risk." },
    { icon: Lock,        title: "End-to-end Secure", desc: "TLS 1.3, AES-256 at rest, 2FA, device fingerprinting, and continuous fraud monitoring." },
    { icon: Banknote,    title: "Global Payments",   desc: "Accept cards, wallets and bank transfers in 135+ currencies via our PCI-certified gateway." },
    { icon: Scale,       title: "Fair Dispute System", desc: "Structured, human-reviewed resolution with full audit trail — decisions in 24–72 hours." },
    { icon: Sparkles,    title: "Beautiful Experience", desc: "A product buyers and sellers actually enjoy using. Real-time updates. Zero friction." },
    { icon: Globe,       title: "Built for Scale",    desc: "99.99% uptime. Horizontal scaling. Webhooks, REST + GraphQL APIs for partners." }
  ];
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-brand-300 font-semibold tracking-widest uppercase text-xs">Why EzyDeal</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">Protection that actually <span className="text-gradient">feels effortless</span>.</h2>
          <p className="mt-4 max-w-2xl text-white/70 text-lg">Every dollar routed through EzyDeal is safeguarded by layered controls engineered by payments veterans from Stripe, PayPal and Wise.</p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="tilt-card glass rounded-2xl p-6 h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-glow">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-white/70 leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: "01", title: "Create the deal", desc: "Buyer and seller agree on terms, amount, and inspection period — all in a signed digital contract." },
    { n: "02", title: "Buyer funds escrow", desc: "Payment is securely held by EzyDeal. The seller sees a verified 'Funded' status and ships with confidence." },
    { n: "03", title: "Seller delivers",   desc: "Upload proof of delivery. Our system notifies the buyer and starts the inspection window." },
    { n: "04", title: "Funds released",    desc: "Buyer approves — funds hit the seller's account instantly. No chargebacks. No drama." }
  ];
  return (
    <section id="how" className="relative py-28 bg-gradient-to-b from-transparent via-ink-950 to-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-brand-300 font-semibold tracking-widest uppercase text-xs">How it works</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">A clear path from <span className="text-gradient">handshake to payout</span>.</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative glass rounded-2xl p-6 h-full">
                <div className="absolute -top-4 -left-4 font-display text-5xl font-black text-brand-400/30 select-none">{s.n}</div>
                <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-white/70 leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  const stats = [
    { k: "$2.4B+", v: "Transacted securely" },
    { k: "420k+", v: "Protected deals" },
    { k: "99.99%", v: "Platform uptime" },
    { k: "4.9/5", v: "Customer rating" }
  ];
  const badges = ["PCI DSS Level 1", "SOC 2 Type II", "GDPR Ready", "ISO 27001", "AES-256", "TLS 1.3"];
  return (
    <section id="trust" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="text-brand-300 font-semibold tracking-widest uppercase text-xs">Built on trust</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">When your money moves, <span className="text-gradient">so does our reputation</span>.</h2>
            <p className="mt-4 text-white/70 text-lg">
              EzyDeal is operated under a licensed money-services framework, with funds held in segregated custodial
              accounts at top-tier banks. Independently audited. Continuously monitored.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {badges.map((b) => (
                <span key={b} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-white/85">
                  <BadgeCheck className="h-4 w-4 text-brand-300" /> {b}
                </span>
              ))}
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.v} delay={i * 0.08}>
                <div className="glass rounded-2xl p-8 text-center">
                  <div className="font-display text-4xl md:text-5xl font-black text-gradient">{s.k}</div>
                  <div className="mt-2 text-white/70">{s.v}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const plans = [
    { name: "Starter",  fee: "3.5%", note: "+ $0.99", desc: "For casual deals up to $500.", highlight: false },
    { name: "Standard", fee: "2.75%", note: "+ $0.99", desc: "Most popular — ideal for marketplaces.", highlight: true },
    { name: "Pro",      fee: "2.0%", note: "no fixed", desc: "Volume discounts for power users.", highlight: false },
    { name: "Enterprise", fee: "1.0%", note: "custom",   desc: "Custom SLA, dedicated manager.", highlight: false }
  ];
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-brand-300 font-semibold tracking-widest uppercase text-xs">Pricing</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">Simple. Transparent. <span className="text-gradient">No surprises</span>.</h2>
          <p className="mt-4 text-white/70 text-lg">You only pay when a deal succeeds. No monthly fees. No setup charges.</p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <div className={`relative tilt-card rounded-2xl p-6 h-full ${p.highlight ? "bg-gradient-to-br from-brand-500/30 to-brand-700/20 border border-brand-400/50 shadow-glow" : "glass"}`}>
                {p.highlight && (
                  <span className="absolute -top-3 right-4 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-ink-950">Most popular</span>
                )}
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-black">{p.fee}</span>
                  <span className="text-white/60">{p.note}</span>
                </div>
                <p className="mt-2 text-white/70">{p.desc}</p>
                <ul className="mt-5 space-y-2 text-sm text-white/75">
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-brand-300" /> Instant payouts</li>
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-brand-300" /> Dispute coverage</li>
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-brand-300" /> Buyer & seller portal</li>
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const q = [
    { t: "We moved $1.2M through EzyDeal last quarter — zero disputes, zero fraud. This is the future of B2B settlements.", a: "Chloé M.", r: "CFO, NovaTrade" },
    { t: "Sold a vintage watch to a stranger overseas. EzyDeal made it feel like I was dealing with my bank. Silky UX.", a: "Arjun S.", r: "Collector, London" },
    { t: "The admin panel is insane. Fees, promos, staff, audit log — everything I need to run a compliant marketplace.", a: "Mei L.",   r: "Founder, BazaarX" }
  ];
  return (
    <section className="relative py-28 bg-gradient-to-b from-transparent via-ink-950 to-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-brand-300 font-semibold tracking-widest uppercase text-xs">Loved by operators</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">Trusted by <span className="text-gradient">thousands of deals</span> every day.</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {q.map((x, i) => (
            <Reveal key={x.a} delay={i * 0.08}>
              <figure className="glass rounded-2xl p-6 h-full">
                <blockquote className="text-white/90 leading-relaxed">&ldquo;{x.t}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{x.a}</span>
                  <span className="text-white/60"> — {x.r}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-brand-400/30 bg-gradient-to-br from-brand-500/30 via-brand-700/10 to-transparent p-12 text-center shadow-glow">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-brand-400/30 blur-3xl" />
            <h2 className="relative font-display text-4xl md:text-5xl font-bold">Your next deal deserves <span className="text-gradient">zero risk</span>.</h2>
            <p className="relative mt-4 text-white/80 text-lg">Open a free EzyDeal account in 60 seconds. No credit card required.</p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="/register" className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 px-8 text-ink-950 font-bold shadow-[0_0_60px_rgba(245,179,1,0.45)] hover:-translate-y-0.5 transition">Create free account</a>
              <a href="#how" className="inline-flex h-14 items-center justify-center rounded-xl glass px-8 font-semibold text-white hover:bg-white/10">See how it works</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="" className="h-7 w-7" />
          <span className="font-display font-bold">Ezy<span className="text-gradient">Deal</span></span>
          <span className="ml-3 text-white/50 text-sm">© {new Date().getFullYear()} EzyDeal, Inc.</span>
        </div>
        <div className="text-sm text-white/60 flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Security</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
