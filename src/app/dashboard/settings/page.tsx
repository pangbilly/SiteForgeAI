import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Settings, User, Database, Key, Shield } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Application configuration and account settings
        </p>
      </div>

      {/* User profile */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-blue-400" />
          <h2 className="text-base font-semibold text-slate-900">Profile</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-500">Name</label>
            <p className="mt-0.5 text-sm text-slate-700">{session?.user?.name}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Email</label>
            <p className="mt-0.5 text-sm text-slate-700">{session?.user?.email}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Role</label>
            <p className="mt-0.5">
              <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-medium text-navy">
                {(session?.user as { role?: string })?.role || "VIEWER"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Key className="h-5 w-5 text-amber-400" />
          <h2 className="text-base font-semibold text-slate-900">API Configuration</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500">Anthropic API Key</label>
            <p className="mt-0.5 text-sm text-slate-500">
              Set via <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">ANTHROPIC_API_KEY</code> in .env.local
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Status</label>
            <p className="mt-0.5">
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                Not configured
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-900">Database</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500">Provider</label>
            <p className="mt-0.5 text-sm text-slate-700">SQLite (local)</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Location</label>
            <p className="mt-0.5 text-sm text-slate-500">
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">prisma/dev.db</code>
            </p>
          </div>
        </div>
      </div>

      {/* Access Control */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-purple-400" />
          <h2 className="text-base font-semibold text-slate-900">Access Control</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-slate-500">Role</th>
                <th className="pb-2 text-left text-xs font-medium text-slate-500">View Docs</th>
                <th className="pb-2 text-left text-xs font-medium text-slate-500">Generate</th>
                <th className="pb-2 text-left text-xs font-medium text-slate-500">Approve</th>
                <th className="pb-2 text-left text-xs font-medium text-slate-500">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { role: "ADMIN", view: true, gen: true, approve: true, admin: true },
                { role: "PM", view: true, gen: true, approve: true, admin: false },
                { role: "VIEWER", view: true, gen: false, approve: false, admin: false },
              ].map((r) => (
                <tr key={r.role}>
                  <td className="py-2 font-medium text-slate-700">{r.role}</td>
                  <td className="py-2">{r.view ? "✓" : "—"}</td>
                  <td className="py-2">{r.gen ? "✓" : "—"}</td>
                  <td className="py-2">{r.approve ? "✓" : "—"}</td>
                  <td className="py-2">{r.admin ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        SiteForge AI v0.1.0 · Pang & Chiu
      </p>
    </div>
  );
}
