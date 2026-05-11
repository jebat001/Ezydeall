import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@ezydeal.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const hash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "EzyDeal Developer",
      passwordHash: hash,
      role: Role.DEVELOPER,
      verified: true
    }
  });

  // Demo buyer + seller
  const demoPass = await bcrypt.hash("Demo@12345", 10);
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@ezydeal.com" },
    update: {},
    create: { email: "buyer@ezydeal.com", name: "Demo Buyer", passwordHash: demoPass, role: Role.USER, verified: true }
  });
  const seller = await prisma.user.upsert({
    where: { email: "seller@ezydeal.com" },
    update: {},
    create: { email: "seller@ezydeal.com", name: "Demo Seller", passwordHash: demoPass, role: Role.USER, verified: true }
  });

  // Default fee tiers
  const tiers = [
    { name: "Starter",  minAmountCents: 0,        maxAmountCents: 50000,    percentBps: 350, fixedCents: 99 },
    { name: "Standard", minAmountCents: 50001,    maxAmountCents: 500000,   percentBps: 275, fixedCents: 99 },
    { name: "Pro",      minAmountCents: 500001,   maxAmountCents: 5000000,  percentBps: 200, fixedCents: 0  },
    { name: "Enterprise", minAmountCents: 5000001, maxAmountCents: 100000000, percentBps: 100, fixedCents: 0 }
  ];
  for (const t of tiers) {
    await prisma.feeTier.upsert({
      where: { id: `seed-${t.name}` },
      update: {},
      create: { id: `seed-${t.name}`, ...t }
    });
  }

  // Welcome promotion
  await prisma.promotion.upsert({
    where: { code: "WELCOME25" },
    update: {},
    create: {
      code: "WELCOME25",
      description: "25% off platform fee on your first deal",
      percentOff: 25,
      active: true,
      createdById: admin.id
    }
  });

  console.log("Seed complete.");
  console.log(`Developer login  -> ${adminEmail} / ${adminPassword}`);
  console.log(`Buyer login      -> buyer@ezydeal.com / Demo@12345`);
  console.log(`Seller login     -> seller@ezydeal.com / Demo@12345`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
