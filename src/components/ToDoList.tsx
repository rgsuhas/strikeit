"use client";
import React from "react";
import { useTasks } from "./UseTasks";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ShareIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

function ListHeader({ listKey, onReset, loading }: { listKey: string, onReset: () => void, loading: boolean }) {
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

function TaskInput({ input, setInput, onAdd, onShare, loading }: {
  input: string,
  setInput: (v: string) => void,
  onAdd: () => void,
  onShare: () => void,
  loading: boolean
}) {
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

function TaskItem({
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
}: {
  task: Task,
  editingId: string | null,
  editingText: string,
  loading: boolean,
  onToggle: (id: string, completed: boolean) => void,
  onEditStart: (id: string, text: string) => void,
  onEditChange: (v: string) => void,
  onEditSave: (id: string) => void,
  onEditCancel: () => void,
  onDelete: (id: string) => void
}) {
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

export default function ToDoList({ listKey }: { listKey: string }) {
  const {
    tasks, input, setInput, editingId, editingText, setEditingText,
    loading, error, lastModified,
    addTask, toggleTask, deleteTask, startEdit, saveEdit, cancelEdit, handleShare, handleReset
  } = useTasks(listKey);

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 text-white">
      <ListHeader listKey={listKey} onReset={handleReset} loading={loading} />
      <TaskInput input={input} setInput={setInput} onAdd={addTask} onShare={handleShare} loading={loading} />

      {/* Status Information */}
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

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
              <PlusIcon className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-lg font-medium">No tasks yet</p>
            <p className="text-sm">Add your first task to get started</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                editingId={editingId}
                editingText={editingText}
                loading={loading}
                onToggle={toggleTask}
                onEditStart={startEdit}
                onEditChange={setEditingText}
                onEditSave={saveEdit}
                onEditCancel={cancelEdit}
                onDelete={deleteTask}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Simple Task Count */}
      {tasks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <div className="text-sm text-zinc-400">
            {tasks.filter(t => t.completed).length} of {tasks.length} completed
          </div>
        </div>
      )}
    </main>
  );
}
