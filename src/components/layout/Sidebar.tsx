"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Settings,
  AlertTriangle,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const CATEGORIES = [
  { key: "planning", label: "Planning", count: 6 },
  { key: "health_safety", label: "Health & Safety", count: 8 },
  { key: "engineering", label: "Engineering", count: 8 },
  { key: "commercial", label: "Commercial", count: 6 },
  { key: "quality", label: "Quality", count: 7 },
  { key: "handover", label: "Handover", count: 8 },
];

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/generate", label: "AI Generate", icon: Sparkles },
  { href: "/dashboard/constraints", label: "Constraints", icon: AlertTriangle },
  { href: "/dashboard/checklists", label: "Checklists", icon: ClipboardCheck },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [docsOpen, setDocsOpen] = useState(false);

  return (
    <nav className="flex h-full flex-col bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-white font-bold text-sm">
          SF
        </div>
        <div>
          <h1 className="text-base font-semibold text-white">SiteForge AI</h1>
          <p className="text-xs text-slate-400">Construction PM Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.href === "/dashboard/documents") {
              return (
                <li key={item.href}>
                  <button
                    onClick={() => setDocsOpen(!docsOpen)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
                      isActive || pathname.startsWith("/dashboard/documents")
                        ? "bg-navy text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">Documents</span>
                    {docsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {docsOpen && (
                    <ul className="ml-8 mt-1 space-y-0.5">
                      <li>
                        <Link
                          href="/dashboard/documents"
                          onClick={onClose}
                          className="block rounded px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 min-h-[36px] flex items-center"
                        >
                          All Documents
                        </Link>
                      </li>
                      {CATEGORIES.map((cat) => (
                        <li key={cat.key}>
                          <Link
                            href={`/dashboard/documents?category=${cat.key}`}
                            onClick={onClose}
                            className="flex items-center justify-between rounded px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 min-h-[36px]"
                          >
                            <span>{cat.label}</span>
                            <span className="text-xs text-slate-500">
                              {cat.count}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
                    isActive
                      ? "bg-navy text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 px-4 py-3">
        <p className="text-xs text-slate-500">Pang & Chiu</p>
        <p className="text-xs text-slate-600">v0.1.0 — Phase 1</p>
      </div>
    </nav>
  );
}
