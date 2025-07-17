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
  console.log("Rendering ListHeader with listKey:", listKey);
  return (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-semibold">
        To-Do List: <span className="font-normal">{listKey}</span>
      </h1>
      <button
        onClick={() => {
          console.log("Reset List clicked");
          onReset();
        }}
        disabled={loading}
        className="bg-zinc-800 text-white rounded-full px-5 py-2.5 text-sm font-medium border-2 border-gray-700 hover:bg-zinc-700 disabled:opacity-50 flex items-center gap-2"
        title="Reset List"
      >
        <ArrowPathIcon className="h-5 w-5" />
        <span className="sr-only">Reset</span>
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
  console.log("Rendering TaskInput with input:", input);
  return (
    <div className="flex gap-3 mb-4">
      <input
        value={input}
        onChange={e => {
          console.log("Input changed:", e.target.value);
          setInput(e.target.value);
        }}
        onKeyDown={e => {
          if (e.key === "Enter") {
            console.log("Enter key pressed in input");
            onAdd();
          }
        }}
        placeholder="What do you want to do?"
        className="flex-1 text-base px-4 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-700 outline-none"
        disabled={loading}
      />
      <button
        onClick={() => {
          console.log("Add button clicked");
          onAdd();
        }}
        disabled={loading}
        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl disabled:opacity-50"
        title="Add Task"
      >
        <PlusIcon className="h-5 w-5" />
        <span className="sr-only">Add</span>
      </button>
      <button
        onClick={() => {
          console.log("Share button clicked");
          onShare();
        }}
        type="button"
        className="text-white bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl"
        title="Share List"
      >
        <ShareIcon className="h-5 w-5" />
        <span className="sr-only">Share</span>
      </button>
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
  console.log("Rendering TaskItem for task:", task);
  return (
    <li className="flex items-center gap-3 mb-4 py-2 px-3 bg-zinc-900 rounded-xl shadow-sm">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => {
          console.log("Toggled task:", task.id, "Completed:", !task.completed);
          onToggle(task.id, !task.completed);
        }}
        disabled={loading}
        className="w-5 h-5 accent-blue-500"
      />
      {editingId === task.id ? (
        <>
          <input
            value={editingText}
            onChange={e => {
              console.log("Editing text changed:", e.target.value);
              onEditChange(e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                console.log("Enter key pressed in edit input for task:", task.id);
                onEditSave(task.id);
              }
            }}
            className="flex-1 text-base px-3 py-2 rounded-md bg-zinc-800 text-white border border-zinc-600"
            disabled={loading}
          />
          <button onClick={() => {
            console.log("Save edit for task:", task.id);
            onEditSave(task.id);
          }} disabled={loading} className="text-white p-2 bg-zinc-700 rounded-md" title="Save">
            <CheckIcon className="h-5 w-5" />
          </button>
          <button onClick={() => {
            console.log("Cancel edit for task:", task.id);
            onEditCancel();
          }} disabled={loading} className="text-white p-2 bg-zinc-700 rounded-md" title="Cancel">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </>
      ) : (
        <>
          <span className={`flex-1 text-lg ${task.completed ? "line-through text-zinc-400" : "text-white"}`}>
            {task.text}
          </span>
          <button onClick={() => {
            console.log("Edit button clicked for task:", task.id);
            onEditStart(task.id, task.text);
          }} disabled={loading} className="text-white p-2 bg-zinc-700 rounded-md" title="Edit">
            <PencilIcon className="h-5 w-5" />
          </button>
          <button onClick={() => {
            console.log("Delete button clicked for task:", task.id);
            onDelete(task.id);
          }} disabled={loading} className="text-white p-2 bg-zinc-700 rounded-md" title="Delete">
            <TrashIcon className="h-5 w-5" />
          </button>
        </>
      )}
    </li>
  );
}

export default function ToDoList({ listKey }: { listKey: string }) {
  console.log("Rendering ToDoList for listKey:", listKey);
  const {
    tasks, input, setInput, editingId, editingText, setEditingText,
    loading, error, lastModified,
    addTask, toggleTask, deleteTask, startEdit, saveEdit, cancelEdit, handleShare, handleReset
  } = useTasks(listKey);

  console.log("Current tasks:", tasks);
  return (
    <main className="max-w-lg mx-auto px-6 py-10 text-white">
      <ListHeader listKey={listKey} onReset={handleReset} loading={loading} />
      <TaskInput input={input} setInput={setInput} onAdd={addTask} onShare={handleShare} loading={loading} />

      {lastModified && (
        <div className="text-sm text-zinc-400 mb-2">
          Last modified: {lastModified.toLocaleString()}
        </div>
      )}
      {error && <div className="text-red-400 mt-2 text-base">{error}</div>}
      {loading && <div className="mt-2 text-base">Loading...</div>}

      <ul className="list-none mt-8 p-0">
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
    </main>
  );
}
