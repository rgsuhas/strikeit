import React from "react";
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Task } from "./types";

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

interface TaskItemProps {
  task: Task;
  editingId: string | null;
  editingText: string;
  loading: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onEditStart: (id: string, text: string) => void;
  onEditChange: (v: string) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDrop: () => void;
  isDraggingOver: boolean;
}

export function TaskItem({
  task,
  editingId,
  editingText,
  loading,
  onToggle,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggingOver,
}: TaskItemProps) {
  const isEditing = editingId === task.id;

  return (
    <li
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(task.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      className={`group relative rounded-xl border transition-all duration-200 ${
        isDraggingOver
          ? "border-indigo-500/40 bg-zinc-800/80 scale-[1.01]"
          : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
      } ${task.completed ? "opacity-60" : ""}`}
    >
      <div className="px-4 py-3">
        {isEditing ? (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 cursor-grab text-zinc-600 select-none text-lg" title="Drag to reorder">
              ⠿
            </div>
            <input
              value={editingText}
              onChange={(e) => onEditChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onEditSave(task.id);
                if (e.key === "Escape") onEditCancel();
              }}
              className="flex-1 text-sm px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-indigo-500/50 outline-none transition-colors"
              disabled={loading}
              autoFocus
            />
            <div className="flex gap-1.5">
              <button
                onClick={() => onEditSave(task.id)}
                disabled={loading}
                className="p-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                title="Save"
              >
                <CheckIcon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onEditCancel}
                disabled={loading}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors"
                title="Cancel"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="flex-shrink-0 cursor-grab text-zinc-700 hover:text-zinc-400 select-none text-lg transition-colors"
              title="Drag to reorder"
            >
              ⠿
            </div>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id, !task.completed)}
              disabled={loading}
              className="w-4 h-4 shrink-0 accent-indigo-500 cursor-pointer"
            />
            <span
              className={`flex-1 text-sm transition-all duration-300 ${
                task.completed
                  ? "line-through text-zinc-600"
                  : "text-zinc-200"
              }`}
            >
              {task.text}
            </span>
            {task.created_at && (
              <span className="text-xs text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                {formatRelativeTime(task.created_at)}
              </span>
            )}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEditStart(task.id, task.text)}
                disabled={loading}
                className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-150"
                title="Edit"
              >
                <PencilIcon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                disabled={loading}
                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all duration-150"
                title="Delete"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
