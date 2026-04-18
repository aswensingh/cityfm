import { Component, inject, input, computed, OnInit, numberAttribute, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TaskService } from '../../../services/task/task.service';
import { ToastService } from '../../../services/toast/toast.service';
import { TaskStatus, TaskPriority } from '../../../models/task.model';

@Component({
  selector: 'app-task-edit',
  imports: [
    ReactiveFormsModule,
    NzFormModule, NzInputModule, NzSelectModule,
    NzDatePickerModule, NzButtonModule, NzIconModule,
  ],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private toast = inject(ToastService);
  private router = inject(Router);

  readonly id = input.required<number, string>({ transform: numberAttribute });
  task = computed(() => this.taskService.tasks().find(t => t.id === this.id()) ?? null);

  statusOptions: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
  priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High'];

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    status: ['Pending' as TaskStatus, [Validators.required]],
    priority: ['Medium' as TaskPriority, [Validators.required]],
    assignedTo: ['', [Validators.required]],
    description: [''],
    dueDate: [null as Date | null],
  });

  constructor() {
    // Fill form when task data loads
    effect(() => {
      const t = this.task();
      if (t) {
        this.form.patchValue({
          name: t.name,
          status: t.status,
          priority: t.priority,
          assignedTo: t.assignedTo,
          description: t.description,
          dueDate: t.details.dueDate ? new Date(t.details.dueDate) : null,
        });
      }
    });
  }

  ngOnInit() {
    this.taskService.loadTasks();
  }

  onSubmit() {
    Object.values(this.form.controls).forEach(c => {
      c.markAsDirty();
      c.updateValueAndValidity();
    });

    if (this.form.invalid) {
      this.toast.warning(this.toast.messages.validationError);
      return;
    }

    const v = this.form.getRawValue();
    this.taskService.updateTask(this.id(), {
      name: v.name,
      status: v.status,
      priority: v.priority,
      assignedTo: v.assignedTo,
      description: v.description,
      details: {
        createdDate: this.task()?.details.createdDate ?? '',
        dueDate: v.dueDate ? v.dueDate.toISOString().split('T')[0] : '',
        notes: this.task()?.details.notes ?? '',
      },
    });

    this.toast.success(this.toast.messages.taskUpdated);
    this.router.navigate(['/app/tasks', this.id()]);
  }

  cancel() {
    this.router.navigate(['/app/tasks', this.id()]);
  }
}
