"use client";

import { useEffect, useState } from "react";
import { X, Download, Loader2, FileText, AlertCircle } from "lucide-react";

interface DocumentViewerProps {
  docId: string;
  onClose: () => void;
}

export function DocumentViewer({ docId, onClose }: DocumentViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [html, setHtml] = useState("");
  const [doc, setDoc] = useState<{
    code: string;
    title: string;
    status: string;
    version: number;
    updatedAt: string;
    hasContent: boolean;
  } | null>(null);

  useEffect(() => {
    async function loadDoc() {
      try {
        const res = await fetch(`/api/documents/${docId}`);
        if (!res.ok) throw new Error("Failed to load document");
        const data = await res.json();
        setDoc(data);

        if (data.contentBase64) {
          // Use mammoth.js to convert docx to HTML
          const mammoth = await import("mammoth");
          const arrayBuffer = Uint8Array.from(atob(data.contentBase64), (c) =>
            c.charCodeAt(0)
          ).buffer;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setHtml(result.value);
        } else {
          setHtml("");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load document");
      } finally {
        setLoading(false);
      }
    }
    loadDoc();
  }, [docId]);

  function handleDownload() {
    window.open(`/api/documents/${docId}/download`, "_blank");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8">
      <div className="w-full max-w-4xl rounded-xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-slate-900 truncate">
              {doc ? `${doc.code} — ${doc.title}` : "Loading..."}
            </h2>
            {doc && (
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>v{doc.version}</span>
                <span>·</span>
                <StatusBadge status={doc.status} />
                <span>·</span>
                <span>Updated {new Date(doc.updatedAt).toLocaleDateString("en-GB")}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-3">
            {doc?.hasContent && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-sm font-medium text-white hover:bg-navy-dark transition-colors min-h-[40px]"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close viewer"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="mt-3 text-sm text-slate-500">Loading document...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="mt-3 text-sm text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && !html && (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                No document content available yet.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Generate this document using AI Generate to add content.
              </p>
            </div>
          )}

          {html && (
            <div
              className="prose prose-sm max-w-none
                prose-headings:text-slate-900 prose-headings:font-semibold
                prose-h1:text-xl prose-h1:text-[#1F4E79] prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-2
                prose-h2:text-lg prose-h2:text-[#2E75B6]
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-li:text-slate-600
                prose-table:border-collapse
                prose-th:bg-[#1F4E79] prose-th:text-white prose-th:px-3 prose-th:py-2 prose-th:text-sm prose-th:font-medium
                prose-td:border prose-td:border-gray-200 prose-td:px-3 prose-td:py-2 prose-td:text-sm prose-td:text-slate-600
                prose-strong:text-slate-900"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    DRAFT: { label: "Draft", cls: "bg-slate-50 text-slate-600" },
    IN_REVIEW: { label: "In Review", cls: "bg-amber-50 text-amber-600" },
    APPROVED: { label: "Approved", cls: "bg-emerald-50 text-emerald-600" },
    ISSUED: { label: "Issued", cls: "bg-sky-50 text-sky-600" },
  };
  const c = config[status] || config.DRAFT;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.cls}`}>
      {c.label}
    </span>
  );
}
