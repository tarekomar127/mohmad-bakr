import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NotificationItem } from '../../../shared/components/notification-item/notification-item';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { NotificationsService } from '../../../services/notifications.service';
import { AppNotification } from '../../../models';

@Component({
  selector: 'app-student-notifications',
  imports: [NotificationItem, EmptyState],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class StudentNotifications {
  private readonly notificationsService = inject(NotificationsService);

  readonly notifications = toSignal(this.notificationsService.getForCurrentStudent(), {
    initialValue: [] as AppNotification[],
  });
}
