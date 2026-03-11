export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  status: Status;
  priority?: Priority;
  dueDate?: string;
  description?: string;
}
