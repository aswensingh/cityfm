import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, CreateTaskPayload } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSignal = signal<Task[]>([]);
  private loaded = false;

  readonly tasks = this.tasksSignal.asReadonly();

  constructor(private http: HttpClient) {}

  loadTasks() {
    if (this.loaded) return;

    this.http.get<{ tasks: Task[] }>('/assets/data/mock-data.json').subscribe(data => {
      this.tasksSignal.set(data.tasks);
      this.loaded = true;
    });
  }

  getTask(id: number) {
    return computed(() => this.tasksSignal().find(t => t.id === id));
  }

  updateTask(id: number, changes: Partial<Task>) {
    this.tasksSignal.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, ...changes } : t)
    );
  }

  createTask(payload: CreateTaskPayload) {
    const tasks = this.tasksSignal();
    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];

    const newTask: Task = {
      id: nextId,
      name: payload.taskName,
      status: 'Pending',
      assignedTo: payload.assignedTo,
      priority: payload.priority,
      description: payload.description ?? '',
      details: {
        createdDate: today,
        dueDate: payload.dueDate ?? '',
        notes: payload.notes ?? '',
      },
    };

    this.tasksSignal.update(tasks => [...tasks, newTask]);
  }
}
