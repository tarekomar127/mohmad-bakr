import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideBell, LucideCalendarOff, LucideClipboardCheck, LucideFileText, LucideVideo } from '@lucide/angular';
import { AppNotification, NotificationKind } from '../../../models';

const KIND_ICON: Record<NotificationKind, string> = {
  exam: 'clipboard',
  holiday: 'calendar',
  video: 'video',
  pdf: 'file',
  general: 'bell',
};

@Component({
  selector: 'app-notification-item',
  imports: [LucideBell, LucideCalendarOff, LucideClipboardCheck, LucideFileText, LucideVideo, DatePipe],
  templateUrl: './notification-item.html',
  styleUrl: './notification-item.scss',
})
export class NotificationItem {
  readonly notification = input.required<AppNotification>();

  readonly iconKind = computed(() => KIND_ICON[this.notification().kind]);
}
