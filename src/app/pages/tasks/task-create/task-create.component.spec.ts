import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskCreateComponent } from './task-create.component';
import { TaskService } from '../../../services/task/task.service';
import { ToastService } from '../../../services/toast/toast.service';

describe('TaskCreateComponent', () => {
  let component: TaskCreateComponent;
  let taskServiceMock: any;
  let toastMock: any;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    const { signal } = await import('@angular/core');
    taskServiceMock = {
      tasks: signal([]),
      loadTasks: jest.fn(),
      createTask: jest.fn(),
      taskIcon: jest.fn(),
    };
    toastMock = {
      success: jest.fn(), warning: jest.fn(), error: jest.fn(),
      messages: { taskCreated: 'created', validationError: 'invalid', loginSuccess: '', loginError: '', taskUpdated: '' },
    };
    routerMock = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [TaskCreateComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ToastService, useValue: toastMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start at step 0', () => {
    expect(component.currentStep()).toBe(0);
  });

  it('next() should not advance if step1 is invalid', () => {
    component.next();
    expect(component.currentStep()).toBe(0);
    expect(toastMock.warning).toHaveBeenCalled();
  });

  it('next() should advance when step1 is valid', () => {
    component.step1.setValue({ taskName: 'Test Task', description: '', priority: 'High' });
    component.next();
    expect(component.currentStep()).toBe(1);
  });

  it('prev() should go back', () => {
    component.step1.setValue({ taskName: 'Test', description: '', priority: 'High' });
    component.next();
    component.prev();
    expect(component.currentStep()).toBe(0);
  });

  it('submit() should create task and navigate', () => {
    component.step1.setValue({ taskName: 'New', description: 'Desc', priority: 'Medium' });
    component.step2.setValue({ assignedTo: 'Alice', dueDate: null, notes: 'Note' });

    component.submit();

    expect(taskServiceMock.createTask).toHaveBeenCalledWith(expect.objectContaining({
      taskName: 'New',
      assignedTo: 'Alice',
      priority: 'Medium',
    }));
    expect(toastMock.success).toHaveBeenCalledWith('created');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/tasks']);
  });
});

