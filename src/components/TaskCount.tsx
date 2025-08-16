import React from "react";

interface TaskCountProps {
  tasks: Array<{ completed: boolean }>;
}

export function TaskCount({ tasks }: TaskCountProps) {
  if (tasks.length === 0) return null;
  
  const completedCount = tasks.filter(t => t.completed).length;
  
  return (
    <div className="mt-8 pt-6 border-t border-zinc-800">
      <div className="text-sm text-zinc-400">
        {completedCount} of {tasks.length} completed
      </div>
    </div>
  );
}
