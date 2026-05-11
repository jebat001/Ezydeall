import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/guard";
import { StaffTable } from "./StaffTable";

export default async function StaffPage() {
  await requireRole("ADMIN");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Staff & roles</h1>
      <p className="text-white/60 mt-1">Promote, demote, or suspend any user. Developers have unrestricted access.</p>
      <div className="mt-6 glass rounded-2xl overflow-hidden">
        <StaffTable users={users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, verified: u.verified, createdAt: u.createdAt.toISOString() }))} />
      </div>
    </div>
  );
}
