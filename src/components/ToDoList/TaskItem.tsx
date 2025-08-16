import React from "react";
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Task } from "./types";

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
  onDelete
}: TaskItemProps) {
  const isEditing = editingId === task.id;
  
  return (
    <li className="group relative bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors duration-200 mb-3 overflow-hidden">
      <div className="p-4">
        {isEditing ? (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 rounded border border-zinc-600 bg-zinc-800"></div>
            </div>
            <input
              value={editingText}
              onChange={e => onEditChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") onEditSave(task.id);
                if (e.key === "Escape") onEditCancel();
              }}
              className="flex-1 text-base px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:border-zinc-500 outline-none transition-colors duration-200"
              disabled={loading}
              autoFocus
            />
            <div className="flex gap-2">
              <button 
                onClick={() => onEditSave(task.id)} 
                disabled={loading} 
                className="p-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors duration-200" 
                title="Save"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={onEditCancel} 
                disabled={loading} 
                className="p-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors duration-200" 
                title="Cancel"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id, !task.completed)}
                disabled={loading}
                className="w-5 h-5 text-zinc-600 bg-zinc-800 border-zinc-600 rounded focus:ring-zinc-500 focus:ring-2 transition-all duration-200 cursor-pointer"
              />
            </div>
            <span className={`flex-1 text-lg transition-all duration-200 ${
              task.completed 
                ? "line-through text-zinc-500" 
                : "text-white"
            }`}>
              {task.text}
            </span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                onClick={() => onEditStart(task.id, task.text)} 
                disabled={loading} 
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors duration-200" 
                title="Edit"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => onDelete(task.id)} 
                disabled={loading} 
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors duration-200" 
                title="Delete"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Subtle completion indicator */}
      {task.completed && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-zinc-600 w-full"></div>
      )}
    </li>
  );
}
