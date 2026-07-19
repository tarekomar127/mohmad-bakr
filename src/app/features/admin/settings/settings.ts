import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideMoon, LucideSun, LucideUpload } from '@lucide/angular';
import { TeacherService } from '../../../services/teacher.service';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { passwordsMatchValidator } from '../../../shared/utils/validators';
import { MediaUrlPipe } from '../../../shared/pipes/media-url.pipe';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, LucideMoon, LucideSun, LucideUpload, MediaUrlPipe],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private readonly teacherService = inject(TeacherService);
  private readonly authService = inject(AuthService);
  readonly theme = inject(ThemeService);
  private readonly fb = inject(FormBuilder);

  readonly profile = this.teacherService.profile;
  readonly avatarPreview = signal<string | null>(null);
  private selectedAvatarFile: File | null = null;
  readonly profileSaved = signal(false);
  readonly passwordSaved = signal(false);
  readonly passwordError = signal('');
  readonly saving = signal(false);

  readonly profileForm = this.fb.group({
    teacherName: ['', Validators.required],
    biography: ['', Validators.required],
    qualifications: ['', Validators.required],
    experience: ['', Validators.required],
  });

  readonly passwordForm = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatchValidator('newPassword', 'confirmPassword') },
  );

  constructor() {
    this.teacherService.load().subscribe((profile) => {
      this.profileForm.patchValue({
        teacherName: profile.teacherName,
        biography: profile.biography,
        qualifications: profile.qualifications,
        experience: profile.experience,
      });
      this.avatarPreview.set(profile.profileImageUrl);
    });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedAvatarFile = file;
      this.avatarPreview.set(URL.createObjectURL(file));
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const value = this.profileForm.getRawValue();
    this.saving.set(true);

    const submit = (profileImageUrl: string) => {
      this.teacherService
        .update({
          teacherName: value.teacherName!,
          biography: value.biography!,
          qualifications: value.qualifications!,
          experience: value.experience!,
          profileImageUrl,
          galleryImages: this.profile()?.galleryImages ?? [],
        })
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.profileSaved.set(true);
            setTimeout(() => this.profileSaved.set(false), 3000);
          },
          error: () => this.saving.set(false),
        });
    };

    if (this.selectedAvatarFile) {
      this.teacherService.uploadProfileImage(this.selectedAvatarFile).subscribe({
        next: (url) => {
          this.selectedAvatarFile = null;
          submit(url);
        },
        error: () => this.saving.set(false),
      });
    } else {
      submit(this.profile()?.profileImageUrl ?? '');
    }
  }

  savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const value = this.passwordForm.getRawValue();
    this.passwordError.set('');
    this.authService
      .changePassword({ currentPassword: value.currentPassword!, newPassword: value.newPassword! })
      .subscribe({
        next: () => {
          this.passwordForm.reset();
          this.passwordSaved.set(true);
          setTimeout(() => this.passwordSaved.set(false), 3000);
        },
        error: (err) => {
          this.passwordError.set(err?.error?.message || 'تعذر تغيير كلمة المرور، تحقق من كلمة المرور الحالية.');
        },
      });
  }
}
