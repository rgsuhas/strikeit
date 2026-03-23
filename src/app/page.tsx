"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [slug, setSlug] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug.trim()) {
      router.push(`/${slug.trim()}`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f172a 50%, #111827 100%)",
      }}
    >
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo / Title */}
        <div className="mb-3 text-center">
          <h1
            className="text-6xl sm:text-7xl font-black tracking-tight text-white"
            style={{
              textShadow: "0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.15)",
              letterSpacing: "-0.03em",
            }}
          >
            strikeit
          </h1>
          <p className="mt-4 text-zinc-400 text-lg font-light tracking-wide">
            Shareable to-do lists. No login. No friction.
          </p>
        </div>

        {/* Card */}
        <div
          className="mt-12 w-full max-w-md rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <p className="text-zinc-500 text-sm mb-4 font-medium uppercase tracking-widest">
            Open a list
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-zinc-600 text-sm shrink-0 font-mono">
                /
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="your-list-name"
                className="flex-1 bg-zinc-900 text-white placeholder-zinc-600 border border-zinc-800 rounded-xl px-4 py-3 text-base outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!slug.trim()}
              className="w-full py-3 px-6 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: slug.trim()
                  ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                  : "#27272a",
                color: "#fff",
                boxShadow: slug.trim() ? "0 4px 24px rgba(99,102,241,0.3)" : "none",
              }}
            >
              Open list →
            </button>
          </form>
        </div>

        <p className="mt-8 text-zinc-700 text-sm">
          Just type a name and share the URL with anyone
        </p>
      </main>

      <footer className="text-center py-6 text-zinc-800 text-xs">
        © 2025 strikeit
      </footer>
    </div>
  );
}
