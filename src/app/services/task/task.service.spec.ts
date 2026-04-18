import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaskService } from './task.service';
import { Task } from '../../models/task.model';

const mockTasks: Task[] = [
  {
    id: 1, name: 'Task 1', status: 'Pending', assignedTo: 'Alice',
    priority: 'High', description: 'Desc 1',
    details: { createdDate: '2024-01-01', dueDate: '2024-02-01', notes: 'Note 1' },
  },
  {
    id: 2, name: 'Task 2', status: 'Completed', assignedTo: 'Bob',
    priority: 'Low', description: 'Desc 2',
    details: { createdDate: '2024-01-02', dueDate: '2024-02-02', notes: '' },
  },
];

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadTasks() should fetch tasks from mock-data.json', () => {
    service.loadTasks();
    const req = httpMock.expectOne('/assets/data/mock-data.json');
    expect(req.request.method).toBe('GET');
    req.flush({ tasks: mockTasks });
    expect(service.tasks().length).toBe(2);
  });

  it('loadTasks() should only fetch once', () => {
    service.loadTasks();
    httpMock.expectOne('/assets/data/mock-data.json').flush({ tasks: mockTasks });
    service.loadTasks(); // second call — no HTTP
    httpMock.expectNone('/assets/data/mock-data.json');
  });

  it('updateTask() should update a task by id', () => {
    service.loadTasks();
    httpMock.expectOne('/assets/data/mock-data.json').flush({ tasks: mockTasks });

    service.updateTask(1, { name: 'Updated' });
    expect(service.tasks().find(t => t.id === 1)?.name).toBe('Updated');
  });

  it('createTask() should add a new task', () => {
    service.loadTasks();
    httpMock.expectOne('/assets/data/mock-data.json').flush({ tasks: mockTasks });

    service.createTask({
      taskName: 'New Task', assignedTo: 'Charlie', priority: 'Medium',
    });
    expect(service.tasks().length).toBe(3);
    expect(service.tasks()[2].name).toBe('New Task');
    expect(service.tasks()[2].id).toBe(3);
  });

  it('taskIcon() should return a deterministic icon name', () => {
    expect(service.taskIcon(0)).toBe('project');
    expect(service.taskIcon(1)).toBe('code');
    expect(service.taskIcon(10)).toBe('project'); // wraps around
  });
});

