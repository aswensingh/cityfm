import { Component, inject, input, computed, OnInit, numberAttribute } from '@angular/core';
import { Router } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { TaskService } from '../../services/task.service';
import { TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [
    NzCollapseModule, NzResultModule, NzTagModule,
    NzButtonModule, NzIconModule, NzDescriptionsModule,
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);

  // Route param :id, auto-converted to number
  readonly id = input.required<number, string>({ transform: numberAttribute });

  task = computed(() => this.taskService.tasks().find(t => t.id === this.id()) ?? null);

  ngOnInit() {
    this.taskService.loadTasks();
  }

  statusColor(status: string): string {
    return { 'Pending': 'orange', 'In Progress': 'blue', 'Completed': 'green' }[status] ?? 'default';
  }

  priorityColor(p: TaskPriority): string {
    return { High: 'red', Medium: 'gold', Low: 'default' }[p];
  }

  goBack() { this.router.navigate(['/app/tasks']); }
  editTask() { this.router.navigate(['/app/tasks', this.id(), 'edit']); }
}
