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
    <main style={{ maxWidth: 500, margin: "2.5rem auto", padding: 24, fontSize: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 28 }}>To-Do List: <span style={{ fontWeight: 400 }}>{listKey}</span></h1>
        <button 
          onClick={handleReset} 
          disabled={loading}
          style={{
            padding: "8px 18px",
            fontSize: 18,
            borderRadius: 6,
            border: "2px solid #b91c1c", // subtle red accent
            background: "#18181b", // dark background
            color: "#fff",
            cursor: "pointer",
            fontWeight: 500,
            boxShadow: "0 1px 4px 0 #0002",
            transition: "background 0.2s, border 0.2s",
          }}
        >
          Reset List
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          style={{ flex: 1, fontSize: 18, padding: "10px 14px", borderRadius: 5, border: "1.5px solid #333", background: "#23232b", color: "#fff" }}
          disabled={loading}
        />
        <button onClick={addTask} disabled={loading} style={{ fontSize: 18, padding: "10px 18px", borderRadius: 5, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Add</button>
        <button onClick={handleShare} type="button" style={{ fontSize: 18, padding: "10px 18px", borderRadius: 5, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Share</button>
      </div>
      {lastModified && (
        <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
          Last modified: {lastModified.toLocaleString()}
        </div>
      )}
      {error && <div style={{ color: "#f87171", marginTop: 8, fontSize: 16 }}>{error}</div>}
      {loading && <div style={{ marginTop: 8, fontSize: 16 }}>Loading...</div>}
      <ul style={{ listStyle: "none", padding: 0, marginTop: 32 }}>
        {tasks.map(task => (
          <li 
            key={task.id} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 12, 
              marginBottom: 14,
              padding: "10px 0",
              borderRadius: "5px",
              // No background or opacity for completed tasks
              boxShadow: task.completed ? "none" : "0 1px 4px 0 #0001"
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id, !task.completed)}
              disabled={loading}
              style={{ width: 22, height: 22, accentColor: task.completed ? "#b91c1c" : "#6366f1", marginRight: 8 }}
            />
            {editingId === task.id ? (
              <>
                <input
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveEdit(task.id)}
                  style={{ flex: 1, fontSize: 18, padding: "8px 12px", borderRadius: 4, border: "1.5px solid #333", background: "#18181b", color: "#fff" }}
                  disabled={loading}
                />
                <button onClick={() => saveEdit(task.id)} disabled={loading} style={{ fontSize: 16, padding: "8px 14px", borderRadius: 4, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Save</button>
                <button onClick={() => setEditingId(null)} disabled={loading} style={{ fontSize: 16, padding: "8px 14px", borderRadius: 4, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Cancel</button>
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
                <button onClick={() => startEdit(task.id, task.text)} disabled={loading} style={{ fontSize: 16, padding: "8px 14px", borderRadius: 4, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Edit</button>
                <button onClick={() => deleteTask(task.id)} disabled={loading} style={{ fontSize: 16, padding: "8px 14px", borderRadius: 4, background: "#23232b", color: "#fff", border: "1.5px solid #333" }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
} 