import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../services/task/task.service';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let taskServiceMock: any;
  let routerMock: jest.Mocked<Router>;

  const mockTasks = [
    { id: 1, name: 'Alpha', status: 'Pending', assignedTo: 'A', priority: 'High', description: 'D1', details: { createdDate: '2024-01-01', dueDate: '2024-02-01', notes: 'N1' } },
    { id: 2, name: 'Beta', status: 'Completed', assignedTo: 'B', priority: 'Low', description: 'D2', details: { createdDate: '2024-01-02', dueDate: '2024-02-02', notes: '' } },
  ];

  beforeEach(async () => {
    const { signal } = await import('@angular/core');
    taskServiceMock = {
      tasks: signal(mockTasks),
      loadTasks: jest.fn(),
      taskIcon: jest.fn().mockReturnValue('code'),
    };
    routerMock = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filteredTasks should return all tasks with empty search', () => {
    expect(component.filteredTasks().length).toBe(2);
  });

  it('filteredTasks should filter by search term', () => {
    component.searchTerm.set('alpha');
    expect(component.filteredTasks().length).toBe(1);
    expect(component.filteredTasks()[0].name).toBe('Alpha');
  });

  it('nameSort should sort alphabetically', () => {
    const a = mockTasks[0];
    const b = mockTasks[1];
    expect(component.nameSort(a as any, b as any)).toBeLessThan(0);
  });

  it('prioritySort should sort by priority order', () => {
    expect(component.prioritySort(mockTasks[0] as any, mockTasks[1] as any)).toBeLessThan(0);
  });

  it('viewTask should navigate', () => {
    component.viewTask(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/tasks', 1]);
  });

  it('editTask should navigate', () => {
    component.editTask(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/tasks', 1, 'edit']);
  });

  it('createTask should navigate', () => {
    component.createTask();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/tasks/create']);
  });

  it('getInitials should return initials', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
  });

  it('statusColor and priorityColor should work', () => {
    expect(component.statusColor('Pending')).toBe('orange');
    expect(component.priorityColor('High')).toBe('red');
  });
});

