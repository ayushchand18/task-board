import { TASK_STATUSES, TaskStatus } from "@/types/task";

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" &&
    (TASK_STATUSES as readonly string[]).includes(value);
}

export function validateTitle(value: unknown): string | null {
  if (typeof value !== "string") {
    return "Title must be a string.";
  }

  const title = value.trim();

  if (!title) {
    return "Task title cannot be empty.";
  }

  if (title.length > 255) {
    return "Task title must be 255 characters or fewer.";
  }

  return null;
}