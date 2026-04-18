import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    sessionStorage.clear();
    router = { navigate: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn should be false initially', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('login() should authenticate valid credentials', (done) => {
    const mockData = {
      auth: {
        users: [{ username: 'admin', password: '1234', displayName: 'Admin', avatarUrl: '' }],
      },
    };

    service.login('admin', '1234').subscribe(success => {
      expect(success).toBe(true);
      expect(service.isLoggedIn()).toBe(true);
      expect(service.currentUser()?.displayName).toBe('Admin');
      expect(service.currentUser()?.password).toBe(''); // password cleared
      done();
    });

    httpMock.expectOne('/assets/data/mock-data.json').flush(mockData);
  });

  it('login() should reject invalid credentials', (done) => {
    const mockData = {
      auth: { users: [{ username: 'admin', password: '1234', displayName: 'Admin', avatarUrl: '' }] },
    };

    service.login('admin', 'wrong').subscribe(success => {
      expect(success).toBe(false);
      expect(service.isLoggedIn()).toBe(false);
      done();
    });

    httpMock.expectOne('/assets/data/mock-data.json').flush(mockData);
  });

  it('logout() should clear user and navigate to /login', () => {
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should restore user from sessionStorage', () => {
    const user = { username: 'a', password: '', displayName: 'A', avatarUrl: '' };
    sessionStorage.setItem('user', JSON.stringify(user));

    // Recreate service to trigger loadFromSession
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });
    const fresh = TestBed.inject(AuthService);
    expect(fresh.isLoggedIn()).toBe(true);
  });
});

