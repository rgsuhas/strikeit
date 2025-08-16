import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export function EmptyState() {
  return (
    <div className="text-center py-12 text-zinc-400">
      <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
        <PlusIcon className="w-8 h-8 text-zinc-600" />
      </div>
      <p className="text-lg font-medium">No tasks yet</p>
      <p className="text-sm">Add your first task to get started</p>
    </div>
  );
}
