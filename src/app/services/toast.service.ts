import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Toast message strings — matching uiConfig.toasts from mock-data.json
  readonly messages = {
    loginSuccess: 'Login successful',
    loginError: 'Invalid username or password',
    taskCreated: 'Task created successfully',
    taskUpdated: 'Task updated successfully', // Missing update msg from the mock-data.json
    validationError: 'Please fix validation errors',
  };

  constructor(private msg: NzMessageService) {}

  success(text: string) { this.msg.success(text); }
  error(text: string) { this.msg.error(text); }
  warning(text: string) { this.msg.warning(text); }
}
