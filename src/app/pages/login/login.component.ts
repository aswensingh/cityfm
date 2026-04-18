import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NgxParticlesModule, IParticlesProps } from '@tsparticles/angular';
import { Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NzFormModule, NzInputModule, NzButtonModule, NzIconModule, NzCardModule,
    NgxParticlesModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  loading = signal(false); // Set loading false initially
  passwordVisible = false; // Flag to hide/unhide password

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  // Fancy simple particle library I used in my previous company login page
  particlesOptions: IParticlesProps = {
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    particles: {
      color: { value: '#ffffff' },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'none' as const,
        outModes: { default: 'bounce' as const },
      },
      number: {
        value: 60,
        density: { enable: true },
      },
      opacity: { value: 0.4 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.6 } },
      },
    },
    detectRetina: true,
  };

  particlesInit = async (engine: Engine): Promise<void> => {
    await loadSlim(engine);
  };

  onSubmit() {
    // Mark all fields dirty to show errors
    Object.values(this.form.controls).forEach(c => {
      c.markAsDirty();
      c.updateValueAndValidity();
    });

    if (this.form.invalid) {
      // Trigger validation error message if user input invalid
      this.toast.warning(this.toast.messages.validationError);
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.loading.set(true);

    this.auth.login(username, password).subscribe({
      next: (success) => {
        this.loading.set(false);
        if (success) {
          this.toast.success(this.toast.messages.loginSuccess);
          this.router.navigate(['/app/dashboard']);
        } else {
          this.toast.error(this.toast.messages.loginError);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toast.error(this.toast.messages.loginError);
      },
    });
  }
}
