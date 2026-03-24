import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["DRAFT", "IN_REVIEW", "APPROVED", "ISSUED"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN" && role !== "PM") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const body = await req.json();
  const { status } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const doc = await prisma.document.findUnique({ where: { id: params.id } });
  if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  const updated = await prisma.document.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({
    id: updated.id,
    code: updated.code,
    title: updated.title,
    status: updated.status,
  });
}
