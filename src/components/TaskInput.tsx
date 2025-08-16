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
    <div className="space-y-4 mb-8">
      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") onAdd();
          }}
          placeholder="What do you want to do?"
          className="flex-1 text-base px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-zinc-500 outline-none transition-colors duration-200 placeholder-zinc-500"
          disabled={loading}
        />
        <button
          onClick={onAdd}
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          title="Add Task"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Add</span>
        </button>
        <button
          onClick={onShare}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors duration-200"
          title="Share List"
        >
          <ShareIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
}
