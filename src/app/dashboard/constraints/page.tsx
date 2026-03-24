import { prisma } from "@/lib/prisma";
import { AlertTriangle, Shield, Zap, Building2, Leaf } from "lucide-react";

const CATEGORY_ICONS: Record<string, typeof AlertTriangle> = {
  access: Zap,
  services: Building2,
  environment: Leaf,
  structural: Shield,
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  high: { label: "HIGH", color: "text-red-600", bg: "bg-red-50", dot: "bg-red-500" },
  medium: { label: "MEDIUM", color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
  low: { label: "LOW", color: "text-green-600", bg: "bg-green-50", dot: "bg-green-500" },
};

export default async function ConstraintsPage() {
  const projects = await prisma.project.findMany({
    where: { status: "active" },
    include: { constraints: { orderBy: { severity: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Constraints Register</h1>
        <p className="mt-1 text-sm text-slate-500">
          Site constraints across all active projects
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {["high", "medium", "low"].map((sev) => {
          const total = projects.reduce(
            (n, p) => n + p.constraints.filter((c) => c.severity === sev).length,
            0
          );
          const cfg = SEVERITY_CONFIG[sev];
          return (
            <div key={sev} className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm`}>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                <span className="text-xs font-medium text-slate-500 uppercase">{cfg.label}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{total}</p>
            </div>
          );
        })}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 uppercase">Total</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {projects.reduce((n, p) => n + p.constraints.length, 0)}
          </p>
        </div>
      </div>

      {/* Per-project constraint tables */}
      {projects.map((project) => (
        <div key={project.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              {project.code} — {project.name}
            </h2>
            <span className="text-xs text-slate-400">{project.constraints.length} constraints</span>
          </div>
          <div className="divide-y divide-gray-100">
            {project.constraints.map((c) => {
              const sev = SEVERITY_CONFIG[c.severity] || SEVERITY_CONFIG.medium;
              const Icon = CATEGORY_ICONS[c.category] || AlertTriangle;
              return (
                <div key={c.id} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 shrink-0">
                    <Icon className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{c.title}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="uppercase">{c.category}</span>
                      <span>·</span>
                      <span>Owner: {c.owner || "TBC"}</span>
                      <span>·</span>
                      <span className={`font-medium ${c.status === "open" ? "text-red-600" : "text-green-600"}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${sev.bg} ${sev.color}`}>
                    {sev.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
