import { Injectable, inject, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Announcement } from '../models';
import { MOCK_ANNOUNCEMENTS } from '../mock-data';
import { readJson, writeJson } from '../shared/utils/local-store-sync';
import { ContentScopeService } from '../core/services/content-scope.service';

const STORAGE_KEY = 'mock_announcements';

@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  private readonly scope = inject(ContentScopeService);
  private readonly _announcements = signal<Announcement[]>(readJson(STORAGE_KEY, MOCK_ANNOUNCEMENTS));
  readonly announcements = this._announcements.asReadonly();

  getAll(): Observable<Announcement[]> {
    return of(this._announcements()).pipe(delay(300));
  }

  getForCurrentStudent(): Observable<Announcement[]> {
    return of(this.scope.scopeToCurrentStudent(this._announcements(), (a) => a.targetStage)).pipe(
      delay(300),
    );
  }

  add(announcement: Announcement): void {
    this._announcements.update((list) => [announcement, ...list]);
    this.persist();
  }

  remove(id: string): void {
    this._announcements.update((list) => list.filter((a) => a.id !== id));
    this.persist();
  }

  private persist(): void {
    writeJson(STORAGE_KEY, this._announcements());
  }
}
