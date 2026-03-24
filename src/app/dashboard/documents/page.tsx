"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FileText, CheckCircle2, Clock, Send, File, Search,
  Download, PackageOpen, ChevronDown, Eye, Loader2,
} from "lucide-react";
import { DocumentViewer } from "@/components/DocumentViewer";

interface Doc {
  id: string;
  projectId: string;
  category: string;
  code: string;
  title: string;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  hasContent: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof FileText }> = {
  DRAFT: { label: "Draft", color: "text-slate-400", bg: "bg-slate-500/10", icon: File },
  IN_REVIEW: { label: "In Review", color: "text-amber-400", bg: "bg-amber-500/10", icon: Clock },
  APPROVED: { label: "Approved", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  ISSUED: { label: "Issued", color: "text-sky-400", bg: "bg-sky-500/10", icon: Send },
};

const CATEGORIES: Record<string, string> = {
  planning: "Planning",
  health_safety: "Health & Safety",
  engineering: "Engineering",
  commercial: "Commercial",
  quality: "Quality",
  handover: "Handover",
};

const STATUS_FLOW = ["DRAFT", "IN_REVIEW", "APPROVED", "ISSUED"];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    setLoading(true);
    const res = await fetch("/api/documents");
    if (res.ok) setDocs(await res.json());
    setLoading(false);
  }

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (filterCategory && d.category !== filterCategory) return false;
      if (filterStatus && d.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!d.title.toLowerCase().includes(q) && !d.code.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [docs, filterCategory, filterStatus, search]);

  const grouped = useMemo(() => {
    const g: Record<string, Doc[]> = {};
    for (const d of filtered) {
      if (!g[d.category]) g[d.category] = [];
      g[d.category].push(d);
    }
    return g;
  }, [filtered]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((d) => d.id)));
    }
  }

  async function handleBulkDownload() {
    const ids = Array.from(selected).filter((id) => docs.find((d) => d.id === id)?.hasContent);
    if (ids.length === 0) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/documents/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docIds: ids }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "SiteForge_Documents.zip";
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setDownloading(false);
    }
  }

  async function handleStatusChange(docId: string, newStatus: string) {
    setStatusUpdating(docId);
    try {
      const res = await fetch(`/api/documents/${docId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, status: newStatus } : d)));
      }
    } finally {
      setStatusUpdating(null);
    }
  }

  const selectedWithContent = Array.from(selected).filter((id) => docs.find((d) => d.id === id)?.hasContent).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <p className="mt-1 text-sm text-slate-400">
            {filtered.length} of {docs.length} documents
          </p>
        </div>
        {selected.size > 0 && (
          <button
            onClick={handleBulkDownload}
            disabled={downloading || selectedWithContent === 0}
            className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-dark transition-colors disabled:opacity-50 min-h-[44px]"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageOpen className="h-4 w-4" />}
            Download {selectedWithContent} as ZIP
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by title or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy min-h-[44px]"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory("")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors min-h-[36px] ${
            !filterCategory ? "bg-navy text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterCategory(filterCategory === key ? "" : key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors min-h-[36px] ${
              filterCategory === key ? "bg-navy text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "" : key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors min-h-[36px] inline-flex items-center gap-1.5 ${
              filterStatus === key ? "bg-navy text-white" : `${cfg.bg} ${cfg.color} hover:opacity-80`
            }`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Select all */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 transition-colors min-h-[32px]"
        >
          <span className={`flex h-4 w-4 items-center justify-center rounded border ${
            selected.size === filtered.length && filtered.length > 0
              ? "border-blue-500 bg-blue-500"
              : "border-slate-600"
          }`}>
            {selected.size === filtered.length && filtered.length > 0 && (
              <CheckCircle2 className="h-3 w-3 text-white" />
            )}
          </span>
          {selected.size > 0 ? `${selected.size} selected` : "Select all"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      )}

      {/* Document groups */}
      {!loading && Object.entries(grouped).map(([category, catDocs]) => (
        <div key={category} className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              {CATEGORIES[category] || category} ({catDocs.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-800/50">
            {catDocs.map((doc) => {
              const cfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.DRAFT;
              const Icon = cfg.icon;
              const isSelected = selected.has(doc.id);

              return (
                <div
                  key={doc.id}
                  className={`flex items-center gap-3 px-5 py-3 transition-colors cursor-pointer ${
                    isSelected ? "bg-navy/10" : "hover:bg-slate-800/30"
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSelect(doc.id)}
                    className={`flex h-5 w-5 items-center justify-center rounded border shrink-0 ${
                      isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </button>

                  {/* Icon */}
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cfg.bg} shrink-0`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0" onClick={() => setViewingDocId(doc.id)}>
                    <p className="text-sm font-medium text-white truncate">
                      {doc.code} — {doc.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>v{doc.version}</span>
                      <span>·</span>
                      <span>{new Date(doc.updatedAt).toLocaleDateString("en-GB")}</span>
                      {doc.hasContent && (
                        <>
                          <span>·</span>
                          <span className="text-blue-400">Has content</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status dropdown */}
                    <div className="relative group">
                      <button className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color} hover:opacity-80 transition-colors min-h-[28px]`}>
                        {cfg.label}
                        <ChevronDown className="ml-1 inline h-3 w-3" />
                      </button>
                      <div className="absolute right-0 top-full z-40 mt-1 hidden group-hover:block w-32 rounded-lg border border-slate-700 bg-slate-800 shadow-xl py-1">
                        {STATUS_FLOW.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(doc.id, s)}
                            disabled={statusUpdating === doc.id}
                            className={`block w-full px-3 py-1.5 text-left text-xs transition-colors min-h-[32px] ${
                              doc.status === s ? "text-white bg-slate-700" : "text-slate-300 hover:bg-slate-700"
                            }`}
                          >
                            {STATUS_CONFIG[s]?.label || s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* View */}
                    <button
                      onClick={() => setViewingDocId(doc.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
                      title="View document"
                    >
                      <Eye className="h-4 w-4 text-slate-400" />
                    </button>

                    {/* Download */}
                    {doc.hasContent && (
                      <button
                        onClick={() => window.open(`/api/documents/${doc.id}/download`, "_blank")}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
                        title="Download .docx"
                      >
                        <Download className="h-4 w-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">No documents match your filters.</p>
        </div>
      )}

      {/* Document viewer modal */}
      {viewingDocId && (
        <DocumentViewer docId={viewingDocId} onClose={() => setViewingDocId(null)} />
      )}
    </div>
  );
}
