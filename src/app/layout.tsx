import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "EzyDeal — Secure Escrow for Modern Commerce",
  description:
    "EzyDeal is the trusted escrow platform protecting buyers and sellers worldwide. Fund. Deliver. Release — with zero risk.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "EzyDeal — Secure Escrow Platform",
    description: "Protect every online deal with bank-grade escrow.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
