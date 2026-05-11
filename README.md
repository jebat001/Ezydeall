# EzyDeal — Secure Escrow Platform

A full-stack, production-ready escrow platform with a 3D animated landing page, payment gateway integration, full user & developer dashboards, role-based access control, a configurable fee engine, promotions, and an immutable audit log.

## Tech Stack

- **Next.js 14** (App Router, TypeScript, Server Components)
- **Prisma ORM** + SQLite (dev) / PostgreSQL (prod)
- **NextAuth.js** — credential auth + role claims in JWT
- **Stripe** — payment gateway with `manual capture` for true escrow hold
- **React Three Fiber + drei** — 3D hero
- **Framer Motion** — scroll reveals & animations
- **Tailwind CSS** — custom dark design system
- **Zod** — input validation
- **bcryptjs** — password hashing

## Features

### Public / Marketing
- 3D animated hero (interactive vault + orbit rings + sparkles)
- Scroll-reveal feature, how-it-works, trust, pricing, testimonials, CTA
- Custom SVG logo + favicon
- Professional trust copy & compliance badges

### Auth & Roles
- Register / Login (credentials, hashed passwords)
- Four roles with hierarchy: `USER → STAFF → ADMIN → DEVELOPER`
- Middleware protects `/dashboard/*` and `/admin/*`

### Escrow Engine
- Create deal (buyer or seller initiates)
- Fee computed from tier + promotion
- Fund via Stripe PaymentIntent with `capture_method: manual` (true hold)
- Seller marks delivered → buyer releases → funds captured
- Disputes with reason, status, resolution
- Stripe webhook handler
- Fallback "simulated funding" when Stripe keys are not set — so you can demo the complete flow instantly

### User Dashboard
- Overview (active deals, volume settled, completed count)
- Deal list
- Create new deal (amount, counterparty email, role, inspection days, promo)
- Deal detail with fund / deliver / release / dispute actions

### Developer / Admin Panel
- Ops overview (users, deals, volume, open disputes, fee revenue)
- Staff & roles (promote / demote)
- Fees (live-edit tiered pricing bands)
- Promotions (create / enable / disable)
- Transactions (all deals across the platform)
- Audit log (immutable trail of every privileged action)

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# (Optionally fill in Stripe keys — not required for local demo)

# 3. Create DB + seed data
npm run db:push
npm run db:seed

# 4. Run
npm run dev
# Open http://localhost:3000
```

### Seeded accounts

| Role | Email | Password |
|---|---|---|
| Developer | `admin@ezydeal.com` | `Admin@12345` |
| Buyer | `buyer@ezydeal.com` | `Demo@12345` |
| Seller | `seller@ezydeal.com` | `Demo@12345` |

## Production notes

1. Switch `datasource db` provider in `prisma/schema.prisma` to `postgresql` and point `DATABASE_URL` at your PG instance.
2. Fill in real `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Set a strong `NEXTAUTH_SECRET`.
4. Configure the Stripe webhook to hit `POST /api/stripe/webhook` with events:
   - `payment_intent.amount_capturable_updated`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Deploy to Vercel (one-click) or any Node host.

## Directory layout

```
src/
  app/
    page.tsx                 ← Landing (3D hero + sections)
    layout.tsx
    login/                   ← Auth pages
    register/
    dashboard/               ← User workspace
      page.tsx
      deals/[id]/
      deals/new/
    admin/                   ← Developer / Admin panel
      page.tsx
      staff/
      fees/
      promotions/
      transactions/
      audit/
    api/
      register/
      auth/[...nextauth]/
      deals/                 ← create, list, detail, fund, deliver, release, dispute, refund
      admin/                 ← fees, promotions, users
      stripe/webhook/
  components/
    marketing/               ← Hero3D, Sections, Navbar, Reveal
    app/                     ← AppShell, StatusPill
    ui/                      ← Button
  lib/
    db.ts, auth.ts, rbac.ts, guard.ts, fees.ts, stripe.ts, audit.ts, utils.ts
prisma/
  schema.prisma
  seed.ts
public/
  logo.svg, icon.svg
```

## Security posture

- Passwords hashed with bcrypt (cost 10)
- JWT sessions (NextAuth) with role claim
- RBAC enforced both client (UI hiding) and server (API guards)
- Zod validation on every POST
- Audit log on every privileged mutation
- Stripe manual-capture pattern prevents premature seller payout
- Webhook signature verification

## License

MIT — use it, ship it, make money safely.
