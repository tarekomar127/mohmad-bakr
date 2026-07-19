import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideBell } from '@lucide/angular';
import { AppNotification } from '../../../models';

@Component({
  selector: 'app-notification-item',
  imports: [LucideBell, DatePipe],
  templateUrl: './notification-item.html',
  styleUrl: './notification-item.scss',
})
export class NotificationItem {
  readonly notification = input.required<AppNotification>();
}
