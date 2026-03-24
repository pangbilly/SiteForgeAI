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
    { label: "Total Documents", value: totalDocs, icon: FileText, color: "text-navy", bg: "bg-navy/5" },
    { label: "Approved", value: approved, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "In Review", value: inReview, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Draft", value: draft, icon: FileText, color: "text-slate-500", bg: "bg-slate-50" },
    { label: "Issued", value: issued, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Compliance", value: `${compliance}%`, icon: CheckCircle2, color: compliance >= 50 ? "text-emerald-600" : "text-red-600", bg: compliance >= 50 ? "bg-emerald-50" : "bg-red-50" },
    { label: "Open Constraints", value: openConstraints, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "EWNs / CEs", value: `${ewns} / ${ces}`, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {session?.user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
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
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.bg}`}
                >
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                  <p className="text-xs text-slate-500">{kpi.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Constraints Summary */}
      {project?.constraints && project.constraints.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Key Constraints
          </h2>
          <div className="space-y-2">
            {project.constraints.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
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
                  <p className="text-sm text-slate-700">{c.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {c.category.toUpperCase()} — Owner: {c.owner || "TBC"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.severity === "high"
                      ? "bg-red-50 text-red-600"
                      : c.severity === "medium"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-green-50 text-green-600"
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
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Change Register
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left text-xs font-medium text-slate-400">Ref</th>
                  <th className="pb-2 text-left text-xs font-medium text-slate-400">Type</th>
                  <th className="pb-2 text-left text-xs font-medium text-slate-400 hidden sm:table-cell">Description</th>
                  <th className="pb-2 text-left text-xs font-medium text-slate-400">Status</th>
                  <th className="pb-2 text-right text-xs font-medium text-slate-400">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {project.changeItems.slice(0, 8).map((ch) => (
                  <tr key={ch.id} className="hover:bg-gray-50">
                    <td className="py-2 font-mono text-xs text-navy font-medium">{ch.reference}</td>
                    <td className="py-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                          ch.type === "CE"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {ch.type}
                      </span>
                    </td>
                    <td className="py-2 text-slate-600 max-w-xs truncate hidden sm:table-cell">{ch.title}</td>
                    <td className="py-2">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-slate-600">{ch.status}</span>
                    </td>
                    <td className="py-2 text-right font-mono text-xs text-slate-600">
                      {ch.value ? `\u00A3${ch.value.toLocaleString()}` : "\u2014"}
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
