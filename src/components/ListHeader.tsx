import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface ListHeaderProps {
  listKey: string;
  onReset: () => void;
  loading: boolean;
}

export function ListHeader({ listKey, onReset, loading }: ListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          To-Do List
        </h1>
        <p className="text-zinc-400 mt-1">
          {listKey}
        </p>
      </div>
      <button
        onClick={onReset}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-white rounded-lg font-medium border border-zinc-700 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        title="Reset List"
      >
        <ArrowPathIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Reset</span>
      </button>
    </div>
  );
}
