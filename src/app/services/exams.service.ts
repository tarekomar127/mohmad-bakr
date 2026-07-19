import { Injectable, inject, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Exam } from '../models';
import { MOCK_EXAMS } from '../mock-data';
import { readJson, writeJson } from '../shared/utils/local-store-sync';
import { ContentScopeService } from '../core/services/content-scope.service';

const STORAGE_KEY = 'mock_exams';

@Injectable({ providedIn: 'root' })
export class ExamsService {
  private readonly scope = inject(ContentScopeService);
  private readonly _exams = signal<Exam[]>(readJson(STORAGE_KEY, MOCK_EXAMS));
  readonly exams = this._exams.asReadonly();

  getAll(): Observable<Exam[]> {
    return of(this._exams()).pipe(delay(300));
  }

  getForCurrentStudent(): Observable<Exam[]> {
    const published = this._exams().filter((e) => e.status === 'published');
    return of(this.scope.scopeToCurrentStudent(published, (e) => e.stage)).pipe(delay(300));
  }

  getById(id: string): Exam | undefined {
    return this._exams().find((e) => e.id === id);
  }

  add(exam: Exam): void {
    this._exams.update((list) => [exam, ...list]);
    this.persist();
  }

  update(id: string, patch: Partial<Exam>): void {
    this._exams.update((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    this.persist();
  }

  remove(id: string): void {
    this._exams.update((list) => list.filter((e) => e.id !== id));
    this.persist();
  }

  private persist(): void {
    writeJson(STORAGE_KEY, this._exams());
  }
}
