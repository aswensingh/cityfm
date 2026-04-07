import { Component, inject, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    NzCardModule, NzIconModule, NzTableModule,
    NzTagModule, NzButtonModule, NzAvatarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private taskService = inject(TaskService);
  private auth = inject(AuthService);
  private router = inject(Router);

  user = this.auth.currentUser;
  today = new Date();

  totalTasks = computed(() => this.taskService.tasks().length);
  inProgress = computed(() => this.taskService.tasks().filter(t => t.status === 'In Progress').length);
  completed = computed(() => this.taskService.tasks().filter(t => t.status === 'Completed').length);
  pending = computed(() => this.taskService.tasks().filter(t => t.status === 'Pending').length);

  recentTasks = computed(() =>
    [...this.taskService.tasks()].sort((a, b) => b.id - a.id).slice(0, 3)
  );

  ngOnInit() {
    this.taskService.loadTasks();
  }

  statusColor(status: string): string {
    return { 'Pending': 'orange', 'In Progress': 'blue', 'Completed': 'green' }[status] ?? 'default';
  }

  priorityColor(p: TaskPriority): string {
    return { High: 'red', Medium: 'gold', Low: 'default' }[p];
  }

  viewTask(id: number) {
    this.router.navigate(['/app/tasks', id]);
  }
}
