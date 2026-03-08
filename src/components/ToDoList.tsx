"use client";
import React, { useRef, useState, useEffect } from "react";
import { useTasks } from "./UseTasks";
import { ListHeader } from "./ListHeader";
import { TaskInput } from "./TaskInput";
import { TaskItem } from "./TaskItem";
import { EmptyState } from "./EmptyState";
import { TaskCount } from "./TaskCount";
import { ToastContainer } from "./Toast";
import type { Task } from "./types";

export default function ToDoList({ listKey }: { listKey: string }) {
  const {
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
  } = useTasks(listKey);

  const [mounted, setMounted] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overIdState, setOverId] = useState<string | null>(null);
  const dragOrder = useRef<Task[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleDragStart = (id: string) => {
    setDragId(id);
    dragOrder.current = [...tasks];
  };

  const handleDragOver = (id: string) => {
    if (!dragId || dragId === id) return;
    setOverId(id);
    const from = dragOrder.current.findIndex((t) => t.id === dragId);
    const to = dragOrder.current.findIndex((t) => t.id === id);
    if (from === -1 || to === -1) return;
    const reordered = [...dragOrder.current];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    dragOrder.current = reordered;
  };

  const handleDrop = () => {
    if (dragId && dragOrder.current.length > 0) {
      reorderTasks(dragOrder.current);
    }
    setDragId(null);
    setOverId(null);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f172a 50%, #111827 100%)",
      }}
    >
      <main
        className="max-w-2xl mx-auto px-4 sm:px-6 py-10 text-white"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <ListHeader listKey={listKey} onReset={handleReset} loading={loading} />

        {/* Progress bar */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-zinc-500 font-medium">Progress</span>
              <span className="text-xs text-zinc-500">{progressPct}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #6366f1 0%, #22d3ee 100%)",
                }}
              />
            </div>
          </div>
        )}

        <TaskInput
          input={input}
          setInput={setInput}
          onAdd={addTask}
          onShare={handleShare}
          loading={loading}
        />

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-950/50 border border-red-800/40 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && tasks.length === 0 && (
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
            <div className="w-3.5 h-3.5 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
            Loading…
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-2">
          {tasks.length === 0 && !loading ? (
            <EmptyState />
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
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
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDraggingOver={overIdState === task.id}
                />
              ))}
            </ul>
          )}
        </div>

        <TaskCount tasks={tasks} />
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
