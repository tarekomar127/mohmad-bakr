import { Injectable, inject, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Video } from '../models';
import { MOCK_VIDEOS } from '../mock-data';
import { readJson, writeJson } from '../shared/utils/local-store-sync';
import { ContentScopeService } from '../core/services/content-scope.service';

const STORAGE_KEY = 'mock_videos';

@Injectable({ providedIn: 'root' })
export class VideosService {
  private readonly scope = inject(ContentScopeService);
  private readonly _videos = signal<Video[]>(readJson(STORAGE_KEY, MOCK_VIDEOS));
  readonly videos = this._videos.asReadonly();

  getAll(): Observable<Video[]> {
    return of(this._videos()).pipe(delay(300));
  }

  getForCurrentStudent(): Observable<Video[]> {
    const published = this._videos().filter((v) => v.status === 'published');
    return of(this.scope.scopeToCurrentStudent(published, (v) => v.stage)).pipe(delay(300));
  }

  getById(id: string): Video | undefined {
    return this._videos().find((v) => v.id === id);
  }

  add(video: Video): void {
    this._videos.update((list) => [video, ...list]);
    this.persist();
  }

  update(id: string, patch: Partial<Video>): void {
    this._videos.update((list) => list.map((v) => (v.id === id ? { ...v, ...patch } : v)));
    this.persist();
  }

  remove(id: string): void {
    this._videos.update((list) => list.filter((v) => v.id !== id));
    this.persist();
  }

  private persist(): void {
    writeJson(STORAGE_KEY, this._videos());
  }
}
