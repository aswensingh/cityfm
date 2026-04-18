import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./pages/tasks/task-list/task-list.component').then(m => m.TaskListComponent),
      },
      {
        path: 'tasks/create',
        loadComponent: () => import('./pages/tasks/task-create/task-create.component').then(m => m.TaskCreateComponent),
      },
      {
        path: 'tasks/:id',
        loadComponent: () => import('./pages/tasks/task-detail/task-detail.component').then(m => m.TaskDetailComponent),
      },
      {
        path: 'tasks/:id/edit',
        loadComponent: () => import('./pages/tasks/task-edit/task-edit.component').then(m => m.TaskEditComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
