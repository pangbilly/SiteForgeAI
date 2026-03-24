import { prisma } from "@/lib/prisma";
import { ClipboardCheck, CheckSquare, Square } from "lucide-react";

export default async function ChecklistsPage() {
  const projects = await prisma.project.findMany({
    where: { status: "active" },
    include: {
      checklists: {
        include: { items: { orderBy: { sortOrder: "asc" } } },
        orderBy: { title: "asc" },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Checklists</h1>
        <p className="mt-1 text-sm text-slate-400">
          Stage gates and pre-start checklists
        </p>
      </div>

      {projects.map((project) =>
        project.checklists.map((checklist) => {
          const total = checklist.items.length;
          const done = checklist.items.filter((i) => i.checked).length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <div key={checklist.id} className="rounded-xl border border-slate-800 bg-slate-900">
              <div className="border-b border-slate-800 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      {checklist.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {project.code} · {checklist.type.replace("_", " ")} · {done}/{total} complete
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`text-lg font-bold ${
                        pct === 100
                          ? "text-emerald-400"
                          : pct >= 50
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      pct === 100
                        ? "bg-emerald-500"
                        : pct >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="divide-y divide-slate-800/50">
                {checklist.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-800/30 transition-colors"
                  >
                    {item.checked ? (
                      <CheckSquare className="h-5 w-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-600 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        item.checked
                          ? "text-slate-500 line-through"
                          : "text-slate-200"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {projects.every((p) => p.checklists.length === 0) && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
          <ClipboardCheck className="mx-auto h-12 w-12 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">No checklists found.</p>
        </div>
      )}
    </div>
  );
}
