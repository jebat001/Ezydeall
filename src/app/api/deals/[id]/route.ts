import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const deal = await prisma.deal.findUnique({
    where: { id: params.id },
    include: {
      buyer: { select: { id: true, email: true, name: true } },
      seller: { select: { id: true, email: true, name: true } },
      dispute: true,
      messages: { orderBy: { createdAt: "asc" } }
    }
  });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const role = (session.user as any).role;
  if (deal.buyerId !== userId && deal.sellerId !== userId && role !== "ADMIN" && role !== "DEVELOPER" && role !== "STAFF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ deal });
}
