export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TaskDetails {
  createdDate: string;
  dueDate: string;
  notes: string;
}

export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
  assignedTo: string;
  priority: TaskPriority;
  description: string;
  imageUrl?: string;
  details: TaskDetails;
}

export interface CreateTaskPayload {
  taskName: string;
  assignedTo: string;
  priority: TaskPriority;
  description?: string;
  dueDate?: string;
  notes?: string;
}
