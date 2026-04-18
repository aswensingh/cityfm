import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskDetailComponent } from './task-detail.component';
import { TaskService } from '../../../services/task/task.service';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let taskServiceMock: any;
  let routerMock: jest.Mocked<Router>;

  const mockTasks = [
    { id: 1, name: 'Task 1', status: 'Pending', assignedTo: 'A', priority: 'High', description: 'Desc', details: { createdDate: '2024-01-01', dueDate: '2024-02-01', notes: 'N' } },
  ];

  beforeEach(async () => {
    const { signal } = await import('@angular/core');
    taskServiceMock = {
      tasks: signal(mockTasks),
      loadTasks: jest.fn(),
      taskIcon: jest.fn().mockReturnValue('project'),
    };
    routerMock = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    // Set the required input
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find the task by id', () => {
    expect(component.task()?.name).toBe('Task 1');
  });

  it('statusColor should return correct color', () => {
    expect(component.statusColor('Pending')).toBe('orange');
  });

  it('priorityColor should return correct color', () => {
    expect(component.priorityColor('High')).toBe('red');
  });

  it('goBack() should navigate to task list', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/tasks']);
  });

  it('editTask() should navigate to edit page', () => {
    component.editTask();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/tasks', 1, 'edit']);
  });
});

