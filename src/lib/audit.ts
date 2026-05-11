import { prisma } from "./db";

export async function audit(opts: {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: opts.actorId ?? null,
      action: opts.action,
      entity: opts.entity,
      entityId: opts.entityId ?? null,
      meta: opts.meta ? JSON.stringify(opts.meta) : null
    }
  });
}
