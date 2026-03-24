"use client";

import { Menu, LogOut, ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

interface Project {
  id: string;
  code: string;
  name: string;
}

interface TopBarProps {
  onMenuToggle: () => void;
  projects: Project[];
  activeProjectId: string | null;
  onProjectChange: (id: string) => void;
}

export function TopBar({
  onMenuToggle,
  projects,
  activeProjectId,
  onProjectChange,
}: TopBarProps) {
  const { data: session } = useSession();
  const [projectOpen, setProjectOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const projectRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (projectRef.current && !projectRef.current.contains(e.target as Node))
        setProjectOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-navy px-4">
      {/* Left: hamburger + project selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>

        {/* Project selector */}
        <div ref={projectRef} className="relative">
          <button
            onClick={() => setProjectOpen(!projectOpen)}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm hover:bg-white/20 transition-colors min-h-[44px]"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-white/20 text-xs font-bold text-white">
              {activeProject?.code?.slice(0, 2) || "—"}
            </span>
            <span className="text-white max-w-[200px] truncate">
              {activeProject?.code || "Select Project"}
            </span>
            <ChevronDown className="h-4 w-4 text-white/70" />
          </button>

          {projectOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-gray-200 bg-white shadow-xl">
              <div className="p-2">
                <p className="px-2 py-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Projects
                </p>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onProjectChange(p.id);
                      setProjectOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors min-h-[44px] ${
                      p.id === activeProjectId
                        ? "bg-navy text-white"
                        : "text-slate-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs font-bold ${
                      p.id === activeProjectId ? "bg-white/20 text-white" : "bg-gray-100 text-slate-600"
                    }`}>
                      {p.code.slice(0, 4)}
                    </span>
                    <div className="text-left">
                      <p className="font-medium">{p.code}</p>
                      <p className={`text-xs truncate max-w-[180px] ${
                        p.id === activeProjectId ? "text-white/70" : "text-slate-400"
                      }`}>
                        {p.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: user menu */}
      <div ref={userRef} className="relative">
        <button
          onClick={() => setUserOpen(!userOpen)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors min-h-[44px]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white text-sm font-bold">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          <span className="hidden sm:block text-sm text-white">
            {session?.user?.name || "User"}
          </span>
          <ChevronDown className="h-4 w-4 text-white/70" />
        </button>

        {userOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-xl">
            <div className="p-3 border-b border-gray-100">
              <p className="text-sm font-medium text-slate-900">
                {session?.user?.name}
              </p>
              <p className="text-xs text-slate-400">{session?.user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-navy/10 px-2 py-0.5 text-xs text-navy font-medium">
                {(session?.user as { role?: string })?.role || "VIEWER"}
              </span>
            </div>
            <div className="p-1">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
