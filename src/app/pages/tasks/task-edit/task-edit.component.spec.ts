import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskEditComponent } from './task-edit.component';
import { TaskService } from '../../../services/task/task.service';
import { ToastService } from '../../../services/toast/toast.service';

describe('TaskEditComponent', () => {
  let component: TaskEditComponent;
  let taskServiceMock: any;
  let toastMock: any;
  let routerMock: jest.Mocked<Router>;

  const mockTasks = [
    { id: 1, name: 'Task 1', status: 'Pending', assignedTo: 'Alice', priority: 'High', description: 'Desc',
      details: { createdDate: '2024-01-01', dueDate: '2024-02-01', notes: 'Note' } },
  ];

  beforeEach(async () => {
    const { signal } = await import('@angular/core');
    taskServiceMock = {
      tasks: signal(mockTasks),
      loadTasks: jest.fn(),
      updateTask: jest.fn(),
      taskIcon: jest.fn(),
    };
    toastMock = {
      success: jest.fn(), warning: jest.fn(), error: jest.fn(),
      messages: { taskUpdated: 'updated', validationError: 'invalid', loginSuccess: '', loginError: '', taskCreated: '' },
    };
    routerMock = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [TaskEditComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ToastService, useValue: toastMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TaskEditComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form with task data via effect', () => {
    expect(component.form.value.name).toBe('Task 1');
    expect(component.form.value.assignedTo).toBe('Alice');
  });

  it('onSubmit() with invalid form should warn', () => {
    component.form.patchValue({ name: '' });
    component.onSubmit();
    expect(toastMock.warning).toHaveBeenCalledWith('invalid');
  });

  it('onSubmit() with valid form should update and navigate', () => {
    component.onSubmit();
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Task 1' }));
    expect(toastMock.success).toHaveBeenCalledWith('updated');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/tasks', 1]);
  });

  it('cancel() should navigate back', () => {
    component.cancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/tasks', 1]);
  });
});

