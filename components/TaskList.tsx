"use client";

import { Task, TaskStatus } from "@/types/task";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  updatingId: number | null;
  deletingId: number | null;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({
  tasks,
  updatingId,
  deletingId,
  onStatusChange,
  onDelete
}: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks yet. Add your first task.</div>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          updating={updatingId === task.id}
          deleting={deletingId === task.id}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}