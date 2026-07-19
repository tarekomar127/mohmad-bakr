import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideSend } from '@lucide/angular';
import { NotificationItem } from '../../../shared/components/notification-item/notification-item';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { NotificationsService } from '../../../services/notifications.service';
import { ALL_STAGES, AppNotification, EducationalStage, STAGE_LABELS } from '../../../models';

@Component({
  selector: 'app-notifications',
  imports: [ReactiveFormsModule, NotificationItem, EmptyState, LucideSend],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  private readonly notificationsService = inject(NotificationsService);
  private readonly fb = inject(FormBuilder);

  readonly stages = ALL_STAGES;
  readonly stageLabels = STAGE_LABELS;
  readonly notifications = signal<AppNotification[]>([]);
  readonly justSent = signal(false);

  constructor() {
    this.reload();
  }

  readonly form = this.fb.group({
    title: ['', Validators.required],
    message: ['', Validators.required],
    targetStage: [null as EducationalStage | null],
  });

  reload(): void {
    this.notificationsService.getAll().subscribe((res) => this.notifications.set(res.items));
  }

  send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.notificationsService
      .send({ title: value.title!, message: value.message!, targetStage: value.targetStage })
      .subscribe(() => {
        this.form.reset({ targetStage: null });
        this.justSent.set(true);
        this.reload();
        setTimeout(() => this.justSent.set(false), 3000);
      });
  }
}
