"use client";
import React from "react";
import { useTasks } from "./UseTasks";
import { ListHeader } from "./ListHeader";
import { TaskInput } from "./TaskInput";
import { TaskItem } from "./TaskItem";
import { StatusInfo } from "./StatusInfo";
import { EmptyState } from "./EmptyState";
import { TaskCount } from "./TaskCount";


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

      <StatusInfo lastModified={lastModified} error={error} loading={loading} />

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <EmptyState />
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

      <TaskCount tasks={tasks} />
    </main>
  );
}
