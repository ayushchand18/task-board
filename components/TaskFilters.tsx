"use client";
import { TaskStatus, TASK_STATUSES } from "@/types/task";
interface TaskFiltersProps {
  value: TaskStatus | "all";
  onChange: (status: TaskStatus | "all") => void;
}
const statusLabels: Record<TaskStatus, string> = {
  todo: "Todo",
  "in-progress": "In Progress",
  done: "Done",
};
export default function TaskFilters({
  value,
  onChange,
}: TaskFiltersProps) {
  return (
    <div className="task-filters">
      <button
        type="button"
        className={value === "all" ? "active" : ""}
        onClick={() => onChange("all")}
      >
        All
      </button>

      {TASK_STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          className={value === status ? "active" : ""}
          onClick={() => onChange(status)}
        >
          {statusLabels[status]}
        </button>
      ))}
    </div>
  );
}