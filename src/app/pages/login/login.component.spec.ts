import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authMock: any;
  let toastMock: any;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    authMock = {
      login: jest.fn(),
      currentUser: () => null,
      isLoggedIn: () => false,
    };
    toastMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      messages: {
        loginSuccess: 'ok', loginError: 'fail', validationError: 'invalid',
        taskCreated: '', taskUpdated: '',
      },
    };
    routerMock = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authMock },
        { provide: ToastService, useValue: toastMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('onSubmit() with invalid form should show warning', () => {
    component.onSubmit();
    expect(toastMock.warning).toHaveBeenCalledWith('invalid');
  });

  it('onSubmit() with valid credentials should navigate on success', () => {
    authMock.login.mockReturnValue(of(true));
    component.form.setValue({ username: 'admin', password: '1234' });

    component.onSubmit();

    expect(authMock.login).toHaveBeenCalledWith('admin', '1234');
    expect(toastMock.success).toHaveBeenCalledWith('ok');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/dashboard']);
    expect(component.loading()).toBe(false);
  });

  it('onSubmit() should show error on failed login', () => {
    authMock.login.mockReturnValue(of(false));
    component.form.setValue({ username: 'admin', password: 'wrong' });

    component.onSubmit();

    expect(toastMock.error).toHaveBeenCalledWith('fail');
    expect(component.loading()).toBe(false);
  });
});

