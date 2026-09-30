"use client";

import { FormEvent, useState } from "react";
import { NewTask, TaskStatus } from "@/types/task";

interface TaskFormProps {
  onCreated: (task: Awaited<ReturnType<typeof createTask>>) => void;
}

async function createTask(input: NewTask) {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to create task.");
  }

  return data;
}

export default function TaskForm({ onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const task = await createTask({
        title: title.trim(),
        status
      });

      onCreated(task);
      setTitle("");
      setStatus("todo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) setError("");
          }}
          placeholder="Enter a task title..."
          maxLength={255}
          aria-label="Task title"
          disabled={loading}
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
          aria-label="Task status"
          disabled={loading}
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
    </form>
  );
}