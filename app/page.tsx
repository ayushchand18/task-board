 "use client";

import { useCallback, useEffect, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task, TaskStatus } from "@/types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tasks", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load tasks.");
      }

      setTasks(data as Task[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  function handleCreated(task: Task) {
    setTasks((current) => [task, ...current]);
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update task.");
      }

      setTasks((current) =>
        current.map((task) => (task.id === id ? data as Task : task))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update task.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Unable to delete task.");
      }

      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete task.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="page">
      <section className="container">
        <header className="header">
          <div>
            <p className="eyebrow">FULL-STACK PROJECT</p>
            <h1>Task Manager</h1>
            <p className="subtitle">
              Manage tasks with Next.js, TypeScript and MySQL.
            </p>
          </div>
          <div className="task-count">{tasks.length} tasks</div>
        </header>

        <TaskForm onCreated={handleCreated} />

        {error && (
          <div className="error-banner" role="alert">
            {error}
            <button type="button" onClick={() => void fetchTasks()}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            updatingId={updatingId}
            deletingId={deletingId}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  );
}