"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, ArrowRight } from "lucide-react";

const Hero3D = dynamic(() => import("./Hero3D").then(m => ({ default: m.Hero3D })), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10" />
});

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-hero-grid">
      <Hero3D />
      <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs text-white/80"
        >
          <ShieldCheck className="h-4 w-4 text-brand-300" />
          Licensed &amp; regulated escrow — protecting every deal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-5xl md:text-7xl font-black leading-[1.02] tracking-tight"
        >
          Move money like it&apos;s
          <br />
          <span className="text-gradient">already trusted</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-white/75"
        >
          EzyDeal is the secure escrow layer for modern commerce. Buyers fund. Sellers deliver.
          Everyone sleeps better. From <span className="text-white">$50 side-hustles</span> to
          <span className="text-white"> $5M acquisitions</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button as="a" href="/register" variant="gold" size="lg">
            Start a secure deal <ArrowRight className="h-5 w-5" />
          </Button>
          <Button as="a" href="#how" variant="secondary" size="lg">
            See how it works
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-widest text-white/50"
        >
          <span>PCI DSS Level 1</span>
          <span>·</span>
          <span>SOC 2 Type II</span>
          <span>·</span>
          <span>ISO 27001</span>
          <span>·</span>
          <span>Segregated custody</span>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="h-10 w-6 rounded-full border border-white/30 flex items-start justify-center p-1"
        >
          <div className="h-2 w-1 rounded-full bg-white/70" />
        </motion.div>
      </div>
    </section>
  );
}
