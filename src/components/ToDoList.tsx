"use client";
import React, { useEffect, useState } from "react";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function ToDoList({ listKey }: { listKey: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastModified, setLastModified] = useState<Date | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    setLoading(true);
    fetch(`/api/tasks/${listKey}`)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLastModified(new Date());
      })
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, [listKey]);

  // Update lastModified on any change
  useEffect(() => {
    if (tasks.length > 0) setLastModified(new Date());
  }, [tasks]);

  const addTask = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${listKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.trim() }),
      });
      if (!res.ok) throw new Error();
      const newTask = await res.json();
      setTasks(t => [...t, newTask]);
      setInput("");
      setLastModified(new Date());
    } catch {
      setError("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${listKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed }),
      });
      if (!res.ok) throw new Error();
      setTasks(t => t.map(task => task.id === id ? { ...task, completed } : task));
      setLastModified(new Date());
    } catch {
      setError("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${listKey}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      setTasks(t => t.filter(task => task.id !== id));
      setLastModified(new Date());
    } catch {
      setError("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${listKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text: editingText }),
      });
      if (!res.ok) throw new Error();
      setTasks(t => t.map(task => task.id === id ? { ...task, text: editingText } : task));
      setEditingId(null);
      setEditingText("");
      setLastModified(new Date());
    } catch {
      setError("Failed to edit task");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL copied to clipboard!");
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to delete all tasks in this list?")) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${listKey}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      });
      if (!res.ok) throw new Error();
      setTasks([]);
      setLastModified(new Date());
    } catch {
      setError("Failed to reset list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1>To-Do List: <span style={{ fontWeight: 400 }}>{listKey}</span></h1>
        <button 
          onClick={handleReset} 
          disabled={loading}
          style={{
            padding: "6px 12px",
            fontSize: 14,
            borderRadius: 4,
            border: "1px solid #dc2626",
            background: "#dc2626",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Reset List
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          style={{ flex: 1 }}
          disabled={loading}
        />
        <button onClick={addTask} disabled={loading}>Add</button>
        <button onClick={handleShare} type="button">Share</button>
      </div>
      {lastModified && (
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
          Last modified: {lastModified.toLocaleString()}
        </div>
      )}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {loading && <div style={{ marginTop: 8 }}>Loading...</div>}
      <ul style={{ listStyle: "none", padding: 0, marginTop: 24 }}>
        {tasks.map(task => (
          <li 
            key={task.id} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              marginBottom: 8,
              padding: "8px",
              borderRadius: "4px",
              background: task.completed ? "#f3f4f6" : "transparent",
              opacity: task.completed ? 0.7 : 1
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id, !task.completed)}
              disabled={loading}
            />
            {editingId === task.id ? (
              <>
                <input
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveEdit(task.id)}
                  style={{ flex: 1 }}
                  disabled={loading}
                />
                <button onClick={() => saveEdit(task.id)} disabled={loading}>Save</button>
                <button onClick={() => setEditingId(null)} disabled={loading}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{ 
                    textDecoration: task.completed ? "line-through" : undefined, 
                    flex: 1,
                    color: task.completed ? "#6b7280" : "inherit"
                  }}
                >
                  {task.text}
                </span>
                <button onClick={() => startEdit(task.id, task.text)} disabled={loading}>Edit</button>
                <button onClick={() => deleteTask(task.id)} disabled={loading}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
} 