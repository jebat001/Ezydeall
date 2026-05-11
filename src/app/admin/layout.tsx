import { AppShell } from "@/components/app/AppShell";
import { requireRole } from "@/lib/guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("STAFF");
  return <AppShell>{children}</AppShell>;
}
