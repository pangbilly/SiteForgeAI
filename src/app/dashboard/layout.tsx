import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const projects = await prisma.project.findMany({
    select: { id: true, code: true, name: true },
    orderBy: { code: "asc" },
  });

  return <AppShell projects={projects}>{children}</AppShell>;
}
