import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (projectId) where.projectId = projectId;
  if (category) where.category = category;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { code: { contains: search } },
    ];
  }

  const documents = await prisma.document.findMany({
    where,
    select: {
      id: true, projectId: true, category: true, code: true,
      title: true, status: true, version: true,
      createdAt: true, updatedAt: true,
      content: false, // Don't send binary content in list
    },
    orderBy: [{ category: "asc" }, { code: "asc" }],
  });

  // Add hasContent flag
  const docsWithFlag = await Promise.all(
    documents.map(async (doc) => {
      const full = await prisma.document.findUnique({
        where: { id: doc.id },
        select: { content: true },
      });
      return { ...doc, hasContent: !!full?.content };
    })
  );

  return NextResponse.json(docsWithFlag);
}
