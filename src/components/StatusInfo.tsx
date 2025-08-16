import React from "react";

interface StatusInfoProps {
  lastModified?: Date | null;
  error?: string | null;
  loading: boolean;
}

export function StatusInfo({ lastModified, error, loading }: StatusInfoProps) {
  return (
    <div className="mb-6 space-y-2">
      {lastModified && (
        <div className="text-sm text-zinc-400 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></div>
          Last modified: {lastModified.toLocaleString()}
        </div>
      )}
      {error && (
        <div className="text-zinc-300 bg-zinc-800/50 px-4 py-3 rounded-lg border border-zinc-700">
          {error}
        </div>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-zinc-400">
          <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin"></div>
          Loading...
        </div>
      )}
    </div>
  );
}
