import { useEffect, useState } from "react";
import type { Task } from "./ToDoList";

export function useTasks(listKey: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastModified, setLastModified] = useState<Date | null>(null);

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

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
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

  return {
    tasks, input, setInput, editingId, editingText, setEditingText,
    loading, error, lastModified,
    addTask, toggleTask, deleteTask, startEdit, saveEdit, cancelEdit, handleShare, handleReset
  };
}
