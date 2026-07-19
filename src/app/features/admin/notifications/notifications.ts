import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideSend } from '@lucide/angular';
import { NotificationItem } from '../../../shared/components/notification-item/notification-item';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { NotificationsService } from '../../../services/notifications.service';
import { ALL_STAGES, AppNotification, STAGE_LABELS, StageTarget } from '../../../models';

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
  readonly notifications = this.notificationsService.notifications;
  readonly justSent = signal(false);

  readonly form = this.fb.group({
    title: ['', Validators.required],
    message: ['', Validators.required],
    targetStage: ['all' as StageTarget, Validators.required],
  });

  send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const notification: AppNotification = {
      id: `notif-${Date.now()}`,
      title: value.title!,
      message: value.message!,
      targetStage: value.targetStage as StageTarget,
      kind: 'general',
      sentAt: new Date().toISOString(),
    };
    this.notificationsService.send(notification);
    this.form.reset({ targetStage: 'all' });
    this.justSent.set(true);
    setTimeout(() => this.justSent.set(false), 3000);
  }
}
