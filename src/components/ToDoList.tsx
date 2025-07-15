"use client";
import React from "react";
import { useTasks } from "./UseTasks";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

function ListHeader({ listKey, onReset, loading }: { listKey: string, onReset: () => void, loading: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h1 style={{ fontSize: 28 }}>To-Do List: <span style={{ fontWeight: 400 }}>{listKey}</span></h1>
      <button 
        onClick={onReset} 
        disabled={loading}
        style={{
              backgroundColor: "#1f2937", // bg-gray-800
              color: "#ffffff",           // text-white
              borderRadius: "9999px",     // rounded-full
              padding: "10px 20px",       // px-5 py-2.5
              fontSize: "14px",           // text-sm
              fontWeight: 500,            // font-medium
              marginRight: "0.5rem",      // me-2
              marginBottom: "0.5rem",     // mb-2
              border: "2px solid #374151",// dark:border-gray-700
              outline: "none",            // focus:outline-none
              cursor: "pointer"           // implied by button
              }} >
        Reset List
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
    <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onAdd()}
        placeholder="Add a task..."
        style={{ flex: 1, fontSize: 18, padding: "10px 14px", borderRadius: 5, border: "1.5px solid #333", background: "#23232b", color: "#fff" }}
        disabled={loading}
      />
      <button onClick={onAdd} disabled={loading} style={{ fontSize: 18, padding: "10px 18px", borderRadius: 5, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Add</button>
      <button onClick={onShare} type="button" style={{ fontSize: 18, padding: "10px 18px", borderRadius: 5, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Share</button>
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
  return (
    <li 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 12, 
        marginBottom: 14,
        padding: "10px 0",
        borderRadius: "5px",
        boxShadow: task.completed ? "none" : "0 1px 4px 0 #0001"
      }}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
        disabled={loading}
        style={{
          width: 22,
          height: 22,
          accentColor: task.completed ? "var(--accent-completed)" : "var(--accent)",
          marginRight: 8
        }}
      />
      {editingId === task.id ? (
        <>
          <input
            value={editingText}
            onChange={e => onEditChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onEditSave(task.id)}
            style={{ flex: 1, fontSize: 18, padding: "8px 12px", borderRadius: 4, border: "1.5px solid #333", background: "#18181b", color: "#fff" }}
            disabled={loading}
          />
          <button onClick={() => onEditSave(task.id)} disabled={loading} style={{ fontSize: 16, padding: "8px 14px", borderRadius: 4, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Save</button>
          <button onClick={onEditCancel} disabled={loading} style={{ fontSize: 16, padding: "8px 14px", borderRadius: 4, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Cancel</button>
        </>
      ) : (
        <>
          <span
            style={{ 
              textDecoration: task.completed ? "line-through" : undefined, 
              flex: 1,
              color: task.completed ? "#b0b0b0" : "#fff",
              fontWeight: 400,
              fontSize: 20,
              letterSpacing: 0.2,
              transition: "color 0.2s, opacity 0.2s"
            }}
          >
            {task.text}
          </span>
          <button onClick={() => onEditStart(task.id, task.text)} disabled={loading} style={{ fontSize: 16, padding: "8px 14px", borderRadius: 4, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Edit</button>
          <button onClick={() => onDelete(task.id)} disabled={loading} style={{ fontSize: 16, padding: "8px 14px", borderRadius: 4, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Delete</button>
        </>
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
    <main style={{ maxWidth: 500, margin: "2.5rem auto", padding: 24, fontSize: 20 }}>
      <ListHeader listKey={listKey} onReset={handleReset} loading={loading} />
      <TaskInput input={input} setInput={setInput} onAdd={addTask} onShare={handleShare} loading={loading} />
      {lastModified && (
        <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
          Last modified: {lastModified.toLocaleString()}
        </div>
      )}
      {error && <div style={{ color: "#f87171", marginTop: 8, fontSize: 16 }}>{error}</div>}
      {loading && <div style={{ marginTop: 8, fontSize: 16 }}>Loading...</div>}
      <ul style={{ listStyle: "none", padding: 0, marginTop: 32 }}>
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