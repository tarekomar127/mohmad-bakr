import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideMoon, LucideSun, LucideUpload } from '@lucide/angular';
import { TeacherService } from '../../../services/teacher.service';
import { ThemeService } from '../../../core/services/theme.service';
import { passwordsMatchValidator } from '../../../shared/utils/validators';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, LucideMoon, LucideSun, LucideUpload],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private readonly teacherService = inject(TeacherService);
  readonly theme = inject(ThemeService);
  private readonly fb = inject(FormBuilder);

  readonly profile = this.teacherService.profile;
  readonly avatarPreview = signal(this.profile().profileImageUrl);
  readonly profileSaved = signal(false);
  readonly passwordSaved = signal(false);

  readonly profileForm = this.fb.group({
    name: [this.profile().name, Validators.required],
    bio: [this.profile().bio, Validators.required],
    youtube: [this.profile().socialLinks.youtube ?? ''],
    facebook: [this.profile().socialLinks.facebook ?? ''],
    instagram: [this.profile().socialLinks.instagram ?? ''],
    tiktok: [this.profile().socialLinks.tiktok ?? ''],
  });

  readonly passwordForm = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatchValidator('newPassword', 'confirmPassword') },
  );

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.avatarPreview.set(URL.createObjectURL(file));
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const value = this.profileForm.getRawValue();
    this.teacherService.update({
      name: value.name!,
      bio: value.bio!,
      profileImageUrl: this.avatarPreview(),
      socialLinks: {
        youtube: value.youtube ?? '',
        facebook: value.facebook ?? '',
        instagram: value.instagram ?? '',
        tiktok: value.tiktok ?? '',
      },
    });
    this.profileSaved.set(true);
    setTimeout(() => this.profileSaved.set(false), 3000);
  }

  savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordForm.reset();
    this.passwordSaved.set(true);
    setTimeout(() => this.passwordSaved.set(false), 3000);
  }
}
