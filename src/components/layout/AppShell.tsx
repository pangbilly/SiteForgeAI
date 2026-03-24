"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { X } from "lucide-react";

interface Project {
  id: string;
  code: string;
  name: string;
}

interface AppShellProps {
  children: React.ReactNode;
  projects: Project[];
}

const STORAGE_KEY = "siteforge-active-project";

export function AppShell({ children, projects }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && projects.some((p) => p.id === stored)) {
      setActiveProjectId(stored);
    } else if (projects.length > 0) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects]);

  function handleProjectChange(id: string) {
    setActiveProjectId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-xl">
            <div className="relative h-full">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-slate-300" />
              </button>
              <Sidebar onClose={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
          projects={projects}
          activeProjectId={activeProjectId}
          onProjectChange={handleProjectChange}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
