import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Get first project for demo
  const project = await prisma.project.findFirst({
    where: { status: "active" },
    include: {
      documents: true,
      constraints: true,
      changeItems: true,
    },
  });

  const totalDocs = project?.documents.length || 0;
  const approved = project?.documents.filter((d) => d.status === "APPROVED").length || 0;
  const inReview = project?.documents.filter((d) => d.status === "IN_REVIEW").length || 0;
  const draft = project?.documents.filter((d) => d.status === "DRAFT").length || 0;
  const issued = project?.documents.filter((d) => d.status === "ISSUED").length || 0;
  const compliance = totalDocs > 0 ? Math.round(((approved + issued) / totalDocs) * 100) : 0;
  const openConstraints = project?.constraints.filter((c) => c.status === "open").length || 0;
  const ewns = project?.changeItems.filter((c) => c.type === "EWN").length || 0;
  const ces = project?.changeItems.filter((c) => c.type === "CE").length || 0;

  const kpis = [
    { label: "Total Documents", value: totalDocs, icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Approved", value: approved, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "In Review", value: inReview, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Draft", value: draft, icon: FileText, color: "text-slate-400", bg: "bg-slate-400/10" },
    { label: "Issued", value: issued, icon: TrendingUp, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Compliance", value: `${compliance}%`, icon: CheckCircle2, color: compliance >= 50 ? "text-emerald-400" : "text-red-400", bg: compliance >= 50 ? "bg-emerald-400/10" : "bg-red-400/10" },
    { label: "Open Constraints", value: openConstraints, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "EWNs / CEs", value: `${ewns} / ${ces}`, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {session?.user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {project?.code} — {project?.name}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.bg}`}
                >
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <p className="text-xs text-slate-400">{kpi.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Constraints Summary */}
      {project?.constraints && project.constraints.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Key Constraints
          </h2>
          <div className="space-y-2">
            {project.constraints.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3"
              >
                <span
                  className={`mt-0.5 inline-block h-2.5 w-2.5 rounded-full shrink-0 ${
                    c.severity === "high"
                      ? "bg-red-500"
                      : c.severity === "medium"
                      ? "bg-amber-500"
                      : "bg-green-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">{c.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {c.category.toUpperCase()} — Owner: {c.owner || "TBC"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.severity === "high"
                      ? "bg-red-500/10 text-red-400"
                      : c.severity === "medium"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-green-500/10 text-green-400"
                  }`}
                >
                  {c.severity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change Register Summary */}
      {project?.changeItems && project.changeItems.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Change Register
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="pb-2 text-left text-xs font-medium text-slate-500">
                    Ref
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-slate-500">
                    Type
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-slate-500 hidden sm:table-cell">
                    Description
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-slate-500">
                    Status
                  </th>
                  <th className="pb-2 text-right text-xs font-medium text-slate-500">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {project.changeItems.slice(0, 8).map((ch) => (
                  <tr key={ch.id} className="hover:bg-slate-800/30">
                    <td className="py-2 font-mono text-xs text-blue-400">
                      {ch.reference}
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                          ch.type === "CE"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {ch.type}
                      </span>
                    </td>
                    <td className="py-2 text-slate-300 max-w-xs truncate hidden sm:table-cell">
                      {ch.title}
                    </td>
                    <td className="py-2">
                      <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
                        {ch.status}
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono text-xs text-slate-300">
                      {ch.value
                        ? `£${ch.value.toLocaleString()}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
