import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get single document (with HTML content for viewer)
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doc = await prisma.document.findUnique({ where: { id: params.id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Return content as base64 for mammoth.js processing client-side
  const contentBase64 = doc.content ? Buffer.from(doc.content).toString("base64") : null;

  return NextResponse.json({
    id: doc.id,
    projectId: doc.projectId,
    category: doc.category,
    code: doc.code,
    title: doc.title,
    status: doc.status,
    version: doc.version,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    hasContent: !!doc.content,
    contentBase64,
    htmlCache: doc.htmlCache,
  });
}
