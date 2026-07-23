import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideBell, LucideTrash2 } from '@lucide/angular';
import { AppNotification } from '../../../models';

@Component({
  selector: 'app-notification-item',
  imports: [LucideBell, LucideTrash2, DatePipe],
  templateUrl: './notification-item.html',
  styleUrl: './notification-item.scss',
})
export class NotificationItem {
  readonly notification = input.required<AppNotification>();
  readonly showDelete = input(false);
  readonly remove = output<void>();
}
