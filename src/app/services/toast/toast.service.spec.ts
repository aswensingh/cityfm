import { TestBed } from '@angular/core/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let msgSpy: jest.Mocked<NzMessageService>;

  beforeEach(() => {
    msgSpy = { success: jest.fn(), error: jest.fn(), warning: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: NzMessageService, useValue: msgSpy },
      ],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delegate success()', () => {
    service.success('ok');
    expect(msgSpy.success).toHaveBeenCalledWith('ok');
  });

  it('should delegate error()', () => {
    service.error('fail');
    expect(msgSpy.error).toHaveBeenCalledWith('fail');
  });

  it('should delegate warning()', () => {
    service.warning('warn');
    expect(msgSpy.warning).toHaveBeenCalledWith('warn');
  });

  it('should have predefined messages', () => {
    expect(service.messages.loginSuccess).toBeDefined();
    expect(service.messages.loginError).toBeDefined();
    expect(service.messages.taskCreated).toBeDefined();
    expect(service.messages.taskUpdated).toBeDefined();
    expect(service.messages.validationError).toBeDefined();
  });
});

