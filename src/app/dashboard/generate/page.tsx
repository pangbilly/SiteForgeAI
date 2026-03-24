import { Sparkles, Upload, FileText, Settings2 } from "lucide-react";

export default function GeneratePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Document Generation</h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload a project brief and generate PM documents using AI
        </p>
      </div>

      {/* Steps overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { step: 1, icon: Upload, title: "Upload Brief", desc: "Upload your project brief (.docx, .pdf, .txt)" },
          { step: 2, icon: FileText, title: "Select Templates", desc: "Choose which documents to generate" },
          { step: 3, icon: Settings2, title: "Configure", desc: "Set tone, sections, and output options" },
          { step: 4, icon: Sparkles, title: "Generate", desc: "AI generates your documents" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-sm font-bold">
                  {s.step}
                </span>
                <Icon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">{s.title}</h3>
              <p className="mt-1 text-xs text-slate-400">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Placeholder CTA */}
      <div className="rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
        <Sparkles className="mx-auto h-12 w-12 text-slate-600" />
        <h2 className="mt-4 text-lg font-semibold text-slate-300">
          Coming in Phase 4
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          AI document generation will be available once the Anthropic Claude API key is configured.
          Upload a brief, select templates, and generate all 43 PM documents in one batch.
        </p>
        <p className="mt-4 text-xs text-slate-600">
          Configure your API key in Settings → API Configuration
        </p>
      </div>
    </div>
  );
}
