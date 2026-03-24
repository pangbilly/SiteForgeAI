"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(error ? "Invalid credentials" : "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoginError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-white text-2xl font-bold">
            SF
          </div>
          <h1 className="text-2xl font-bold text-white">SiteForge AI</h1>
          <p className="mt-1 text-sm text-slate-400">
            Construction PM Assistant
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-6 text-lg font-semibold text-white">Sign In</h2>

          {loginError && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@pangandchiu.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy min-h-[44px]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy min-h-[44px]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-medium text-white hover:bg-navy-dark transition-colors disabled:opacity-50 min-h-[44px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg bg-slate-800/50 p-3">
            <p className="text-xs font-medium text-slate-500 mb-2">
              Demo Credentials
            </p>
            <div className="space-y-1 text-xs text-slate-400">
              <p>
                <span className="text-slate-500">Admin:</span>{" "}
                admin@pangandchiu.com / siteforge2026
              </p>
              <p>
                <span className="text-slate-500">PM:</span>{" "}
                pm@pangandchiu.com / siteforge2026
              </p>
              <p>
                <span className="text-slate-500">Viewer:</span>{" "}
                viewer@pangandchiu.com / siteforge2026
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Pang & Chiu — SiteForge AI v0.1.0
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
