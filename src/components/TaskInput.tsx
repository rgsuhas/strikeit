import React from "react";
import { PlusIcon, ShareIcon } from "@heroicons/react/24/outline";

interface TaskInputProps {
  input: string;
  setInput: (v: string) => void;
  onAdd: () => void;
  onShare: () => void;
  loading: boolean;
}

export function TaskInput({ input, setInput, onAdd, onShare, loading }: TaskInputProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAdd();
            }}
            placeholder="Add a task…"
            className="w-full text-base px-4 py-3 rounded-xl bg-zinc-900 text-white border border-zinc-800 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all duration-200 placeholder-zinc-600"
            disabled={loading}
          />
          {!input && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-700 pointer-events-none select-none hidden sm:block">
              Press Enter to add
            </span>
          )}
        </div>
        <button
          onClick={onAdd}
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium transition-all duration-200 disabled:cursor-not-allowed"
          title="Add Task"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">Add</span>
        </button>
        <button
          onClick={onShare}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium transition-all duration-200"
          title="Copy share link"
        >
          <ShareIcon className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">Share</span>
        </button>
      </div>
    </div>
  );
}
