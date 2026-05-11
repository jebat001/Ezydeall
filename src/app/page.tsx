import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Features, HowItWorks, TrustSection, Pricing, Testimonials, CTA, Footer } from "@/components/marketing/Sections";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <TrustSection />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
