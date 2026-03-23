import { useCallback, useEffect, useRef, useState } from "react";
import type { Task } from "./types";
import type { ToastMessage } from "./Toast";
import { supabase } from "../lib/supabase";

export function useTasks(listKey: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initial load
  useEffect(() => {
    setLoading(true);
    fetch(`/api/tasks/${listKey}`)
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, [listKey]);

  // Supabase Realtime subscription
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("tasks:" + listKey)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `list_key=eq.${listKey}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newTask = payload.new as Task;
            setTasks((prev) => {
              if (prev.find((t) => t.id === newTask.id)) return prev;
              return [...prev, newTask].sort((a, b) => a.position - b.position);
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Task;
            setTasks((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t))
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string };
            setTasks((prev) => prev.filter((t) => t.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }, [listKey]);

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
      const newTask: Task = await res.json();
      setTasks((t) => {
        if (t.find((x) => x.id === newTask.id)) return t;
        return [...t, newTask];
      });
      setInput("");
      showToast("Task added");
    } catch {
      setError("Failed to add task");
      showToast("Failed to add task", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, completed } : task)));
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${listKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Rollback
      setTasks((t) =>
        t.map((task) => (task.id === id ? { ...task, completed: !completed } : task))
      );
      setError("Failed to update task");
      showToast("Failed to update task", "error");
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    const prev = tasks;
    setTasks((t) => t.filter((task) => task.id !== id));
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${listKey}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      showToast("Task deleted");
    } catch {
      // Rollback
      setTasks(prev);
      setError("Failed to delete task");
      showToast("Failed to delete task", "error");
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
      setTasks((t) =>
        t.map((task) => (task.id === id ? { ...task, text: editingText } : task))
      );
      setEditingId(null);
      setEditingText("");
    } catch {
      setError("Failed to edit task");
      showToast("Failed to edit task", "error");
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
    showToast("URL copied to clipboard!");
  };

  const handleReset = async () => {
    if (!confirm("Delete all tasks in this list?")) return;
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
      showToast("List cleared");
    } catch {
      setError("Failed to reset list");
      showToast("Failed to reset list", "error");
    } finally {
      setLoading(false);
    }
  };

  const reorderTasks = async (newOrder: Task[]) => {
    setTasks(newOrder);
    try {
      await fetch(`/api/tasks/${listKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newOrder.map((t) => t.id) }),
      });
    } catch {
      showToast("Failed to save order", "error");
    }
  };

  return {
    tasks,
    input,
    setInput,
    editingId,
    editingText,
    setEditingText,
    loading,
    error,
    toasts,
    dismissToast,
    addTask,
    toggleTask,
    deleteTask,
    startEdit,
    saveEdit,
    cancelEdit,
    handleShare,
    handleReset,
    reorderTasks,
  };
}
