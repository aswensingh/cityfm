import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-create',
  imports: [
    ReactiveFormsModule,
    NzStepsModule, NzFormModule, NzInputModule, NzSelectModule,
    NzDatePickerModule, NzButtonModule, NzIconModule,
    NzDescriptionsModule, NzDividerModule,
  ],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss',
})
export class TaskCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private toast = inject(ToastService);
  private router = inject(Router);

  currentStep = signal(0);

  // Step labels from uiConfig
  stepLabels = ['Task Information', 'Assignment Details', 'Review & Submit'];
  priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High'];

  // Step 1 form
  step1 = this.fb.nonNullable.group({
    taskName: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    priority: ['' as TaskPriority | '', [Validators.required]],
  });

  // Step 2 form
  step2 = this.fb.nonNullable.group({
    assignedTo: ['', [Validators.required]],
    dueDate: [null as Date | null],
    notes: [''],
  });

  ngOnInit() {
    this.taskService.loadTasks();
  }

  next() {
    if (!this.validateCurrentStep()) return;
    this.currentStep.update(s => Math.min(s + 1, 2));
  }

  prev() {
    this.currentStep.update(s => Math.max(s - 1, 0));
  }

  submit() {
    const s1 = this.step1.getRawValue();
    const s2 = this.step2.getRawValue();

    this.taskService.createTask({
      taskName: s1.taskName,
      priority: s1.priority as TaskPriority,
      description: s1.description,
      assignedTo: s2.assignedTo,
      dueDate: s2.dueDate ? s2.dueDate.toISOString().split('T')[0] : undefined,
      notes: s2.notes || undefined,
    });

    this.toast.success(this.toast.messages.taskCreated);
    this.router.navigate(['/app/tasks']);
  }

  get dueDateDisplay(): string {
    const d = this.step2.getRawValue().dueDate;
    return d ? d.toISOString().split('T')[0] : '—';
  }

  private validateCurrentStep(): boolean {
    const group = this.currentStep() === 0 ? this.step1 : this.step2;

    Object.values(group.controls).forEach(c => {
      c.markAsDirty();
      c.updateValueAndValidity();
    });

    if (group.invalid) {
      this.toast.warning(this.toast.messages.validationError);
      return false;
    }
    return true;
  }
}
