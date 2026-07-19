import { Injectable, inject, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { ExamResult } from '../models';
import { MOCK_EXAM_RESULTS } from '../mock-data';
import { readJson, writeJson } from '../shared/utils/local-store-sync';
import { AuthService } from '../core/services/auth.service';

const STORAGE_KEY = 'mock_exam_results';

@Injectable({ providedIn: 'root' })
export class ExamResultsService {
  private readonly auth = inject(AuthService);
  private readonly _results = signal<ExamResult[]>(readJson(STORAGE_KEY, MOCK_EXAM_RESULTS));
  readonly results = this._results.asReadonly();

  getAll(): Observable<ExamResult[]> {
    return of(this._results()).pipe(delay(300));
  }

  getForCurrentStudent(): Observable<ExamResult[]> {
    const user = this.auth.currentUser();
    const mine = this._results().filter((r) => r.studentId === user?.id);
    return of(mine).pipe(delay(300));
  }

  getByStudent(studentId: string): ExamResult[] {
    return this._results().filter((r) => r.studentId === studentId);
  }

  add(result: ExamResult): void {
    this._results.update((list) => [result, ...list]);
    this.persist();
  }

  private persist(): void {
    writeJson(STORAGE_KEY, this._results());
  }
}
