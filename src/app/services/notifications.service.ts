import { Injectable, inject, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AppNotification } from '../models';
import { MOCK_NOTIFICATIONS } from '../mock-data';
import { readJson, writeJson } from '../shared/utils/local-store-sync';
import { ContentScopeService } from '../core/services/content-scope.service';

const STORAGE_KEY = 'mock_notifications';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly scope = inject(ContentScopeService);
  private readonly _notifications = signal<AppNotification[]>(readJson(STORAGE_KEY, MOCK_NOTIFICATIONS));
  readonly notifications = this._notifications.asReadonly();

  getAll(): Observable<AppNotification[]> {
    return of(this._notifications()).pipe(delay(300));
  }

  getForCurrentStudent(): Observable<AppNotification[]> {
    const sorted = [...this._notifications()].sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
    );
    return of(this.scope.scopeToCurrentStudent(sorted, (n) => n.targetStage)).pipe(delay(300));
  }

  send(notification: AppNotification): void {
    this._notifications.update((list) => [notification, ...list]);
    this.persist();
  }

  private persist(): void {
    writeJson(STORAGE_KEY, this._notifications());
  }
}
