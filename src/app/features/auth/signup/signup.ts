import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideEye, LucideEyeOff, LucideUserPlus } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { ALL_STAGES, EducationalStage, STAGE_LABELS } from '../../../models';
import { EGYPT_GOVERNORATES } from '../../../mock-data';
import { egyptianPhoneValidator, passwordsMatchValidator } from '../../../shared/utils/validators';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, LucideEye, LucideEyeOff, LucideUserPlus],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly stages = ALL_STAGES;
  readonly stageLabels = STAGE_LABELS;
  readonly governorates = EGYPT_GOVERNORATES;

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group(
    {
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      parentName: ['', [Validators.required, Validators.minLength(3)]],
      studentPhone: ['', [Validators.required, egyptianPhoneValidator()]],
      parentPhone: ['', [Validators.required, egyptianPhoneValidator()]],
      stage: ['' as EducationalStage | '', Validators.required],
      gender: ['' as 'male' | 'female' | '', Validators.required],
      governorate: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatchValidator('password', 'confirmPassword') },
  );

  get f() {
    return this.form.controls;
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const value = this.form.getRawValue();
    this.auth
      .registerStudent({
        studentName: value.studentName!,
        parentName: value.parentName!,
        studentPhone: value.studentPhone!,
        parentPhone: value.parentPhone!,
        stage: value.stage as EducationalStage,
        gender: value.gender as 'male' | 'female',
        governorate: value.governorate!,
        city: value.city!,
        email: value.email!,
        password: value.password!,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigateByUrl('/student/dashboard');
        },
        error: (err: Error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.message || 'حدث خطأ أثناء إنشاء الحساب');
        },
      });
  }
}
