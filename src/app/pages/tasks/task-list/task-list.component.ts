import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzTableModule, NzTableFilterFn, NzTableFilterList } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { TaskService } from '../../../services/task/task.service';
import { Task, TaskPriority, TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-task-list',
  imports: [
    FormsModule,
    NzTableModule, NzTagModule, NzButtonModule,
    NzIconModule, NzInputModule, NzAvatarModule, NzCardModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);

  searchTerm = signal('');

  filteredTasks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const all = this.taskService.tasks();
    return term ? all.filter(t => t.name.toLowerCase().includes(term)) : all;
  });

  // Sort functions for all table columns
  nameSort = (a: Task, b: Task) => a.name.localeCompare(b.name);
  descSort = (a: Task, b: Task) => (a.description || '').localeCompare(b.description || '');
  statusSort = (a: Task, b: Task) => a.status.localeCompare(b.status);
  prioritySort = (a: Task, b: Task) => {
    const order: Record<TaskPriority, number> = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  };
  assignedSort = (a: Task, b: Task) => a.assignedTo.localeCompare(b.assignedTo);
  createdDateSort = (a: Task, b: Task) => a.details.createdDate.localeCompare(b.details.createdDate);
  dueDateSort = (a: Task, b: Task) => a.details.dueDate.localeCompare(b.details.dueDate);
  notesSort = (a: Task, b: Task) => (a.details.notes || '').localeCompare(b.details.notes || '');

  // Column filter lists (shown as checkboxes in the header dropdown)
  statusFilters: NzTableFilterList = [
    { text: 'Pending', value: 'Pending' },
    { text: 'In Progress', value: 'In Progress' },
    { text: 'Completed', value: 'Completed' },
  ];

  priorityFilters: NzTableFilterList = [
    { text: 'High', value: 'High' },
    { text: 'Medium', value: 'Medium' },
    { text: 'Low', value: 'Low' },
  ];

  // Column filter functions
  statusFilterFn: NzTableFilterFn<Task> = (values: string[], item: Task) => values.includes(item.status);
  priorityFilterFn: NzTableFilterFn<Task> = (values: string[], item: Task) => values.includes(item.priority);

  ngOnInit() {
    this.taskService.loadTasks();
  }

  statusColor(status: string): string {
    return { 'Pending': 'orange', 'In Progress': 'blue', 'Completed': 'green' }[status] ?? 'default';
  }

  priorityColor(p: TaskPriority): string {
    return { High: 'red', Medium: 'gold', Low: 'default' }[p];
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  taskIcon(id: number): string {
    return this.taskService.taskIcon(id);
  }

  viewTask(id: number) { this.router.navigate(['/app/tasks', id]); }
  editTask(id: number) { this.router.navigate(['/app/tasks', id, 'edit']); }
  createTask()         { this.router.navigate(['/app/tasks/create']); }
}
