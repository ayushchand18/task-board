export const TASK_STATUSES = ['pending', 'in_progress', 'completed'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  created_at: string;
}
export interface NewTask {
  title: string;
  status: TaskStatus;
}
export interface UpdateTask {
  status: TaskStatus;
}
export interface DeleteTask {
  id: number;
}
export interface TaskFilters {
  status?: TaskStatus;
}
export interface TaskQuery {
  filters?: TaskFilters;
  limit?: number;
  offset?: number;
}
export interface ApiError {
    error: string;
}