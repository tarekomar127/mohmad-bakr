import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideEye, LucideEyeOff, LucideLock, LucideMail } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, LucideEye, LucideEyeOff, LucideLock, LucideMail],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showForgotNotice = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [true],
  });

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleForgotNotice(): void {
    this.showForgotNotice.update((v) => !v);
  }

  fillDemo(role: 'admin' | 'student'): void {
    if (role === 'admin') {
      this.form.patchValue({ email: 'admin@alshafei.mock', password: 'Admin@123' });
    } else {
      this.form.patchValue({ email: 'yousef.ahmed@student.mock', password: 'Student@123' });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set(null);
    this.isSubmitting.set(true);
    const { email, password, rememberMe } = this.form.getRawValue();

    this.auth.login(email!, password!, rememberMe ?? false).subscribe({
      next: (user) => {
        this.isSubmitting.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const fallback = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
        this.router.navigateByUrl(returnUrl || fallback);
      },
      error: (err: Error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'حدث خطأ أثناء تسجيل الدخول');
      },
    });
  }
}
