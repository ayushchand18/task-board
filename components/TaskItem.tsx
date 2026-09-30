"use client";

import { Task, TaskStatus } from "@/types/task";

interface TaskItemProps {
  task: Task;
  updating: boolean;
  deleting: boolean;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: "Todo",
  "in-progress": "In Progress",
  done: "Done"
};

export default function TaskItem({
  task,
  updating,
  deleting,
  onStatusChange,
  onDelete
}: TaskItemProps) {
  return (
    <li className={`task-item status-${task.status}`}>
      <div className="task-content">
        <span className="task-title">{task.title}</span>
        <small>
          {new Date(task.created_at).toLocaleString()}
        </small>
      </div>

      <div className="task-actions">
        <select
          value={task.status}
          disabled={updating || deleting}
          onChange={(event) =>
            onStatusChange(task.id, event.target.value as TaskStatus)
          }
          aria-label={`Status for ${task.title}`}
        >
          {(Object.keys(statusLabels) as TaskStatus[]).map((value) => (
            <option key={value} value={value}>
              {statusLabels[value]}
            </option>
          ))}
        </select>

        <button
          className="delete-button"
          type="button"
          disabled={updating || deleting}
          onClick={() => onDelete(task.id)}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}