import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { TaskService } from '../../services/task/task.service';
import { AuthService } from '../../services/auth/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let taskServiceMock: any;
  let routerMock: jest.Mocked<Router>;

  const mockTasks = [
    { id: 1, name: 'T1', status: 'Pending', assignedTo: 'A', priority: 'High', description: '', details: { createdDate: '', dueDate: '', notes: '' } },
    { id: 2, name: 'T2', status: 'In Progress', assignedTo: 'B', priority: 'Low', description: '', details: { createdDate: '', dueDate: '', notes: '' } },
    { id: 3, name: 'T3', status: 'Completed', assignedTo: 'C', priority: 'Medium', description: '', details: { createdDate: '', dueDate: '', notes: '' } },
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
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TaskService, useValue: taskServiceMock },
        { provide: AuthService, useValue: { currentUser: () => ({ displayName: 'Test' }) } },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute task stats correctly', () => {
    expect(component.totalTasks()).toBe(3);
    expect(component.pending()).toBe(1);
    expect(component.inProgress()).toBe(1);
    expect(component.completed()).toBe(1);
  });

  it('statusColor() should return correct colors', () => {
    expect(component.statusColor('Pending')).toBe('orange');
    expect(component.statusColor('In Progress')).toBe('blue');
    expect(component.statusColor('Completed')).toBe('green');
    expect(component.statusColor('Unknown')).toBe('default');
  });

  it('priorityColor() should return correct colors', () => {
    expect(component.priorityColor('High')).toBe('red');
    expect(component.priorityColor('Medium')).toBe('gold');
    expect(component.priorityColor('Low')).toBe('default');
  });

  it('viewTask() should navigate to task detail', () => {
    component.viewTask(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/tasks', 1]);
  });

  it('ngOnInit should call loadTasks', () => {
    component.ngOnInit();
    expect(taskServiceMock.loadTasks).toHaveBeenCalled();
  });
});

