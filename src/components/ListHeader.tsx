"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface ListHeaderProps {
  listKey: string;
  onReset: () => void;
  loading: boolean;
}

export function ListHeader({ listKey, onReset, loading }: ListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all duration-200"
          title="Back to home"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span>strikeit</span>
            <span>/</span>
          </div>
          <h1 className="text-xl font-semibold text-white leading-tight">
            {listKey}
          </h1>
        </div>
      </div>
      <button
        onClick={onReset}
        disabled={loading}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-zinc-800 border border-transparent hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        title="Reset list"
      >
        <ArrowPathIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Reset</span>
      </button>
    </div>
  );
}
