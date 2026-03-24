import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JSZip from "jszip";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { docIds } = body as { docIds: string[] };

  if (!docIds || !Array.isArray(docIds) || docIds.length === 0) {
    return NextResponse.json({ error: "No document IDs provided" }, { status: 400 });
  }

  const docs = await prisma.document.findMany({
    where: { id: { in: docIds } },
  });

  const docsWithContent = docs.filter((d) => d.content);
  if (docsWithContent.length === 0) {
    return NextResponse.json({ error: "No documents with content found" }, { status: 404 });
  }

  const zip = new JSZip();
  for (const doc of docsWithContent) {
    const filename = `${doc.code}_${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
    zip.file(filename, doc.content!);
  }

  const zipBuf = await zip.generateAsync({ type: "uint8array" });

  return new NextResponse(zipBuf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="SiteForge_Documents.zip"`,
      "Content-Length": zipBuf.length.toString(),
    },
  });
}
