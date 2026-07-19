import { Injectable, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Student } from '../models';
import { MOCK_STUDENTS } from '../mock-data';
import { readJson, writeJson } from '../shared/utils/local-store-sync';

const STORAGE_KEY = 'mock_students';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private readonly _students = signal<Student[]>(readJson(STORAGE_KEY, MOCK_STUDENTS));
  readonly students = this._students.asReadonly();

  getAll(): Observable<Student[]> {
    return of(this._students()).pipe(delay(300));
  }

  getById(id: string): Student | undefined {
    return this._students().find((s) => s.id === id);
  }

  getByEmail(email: string): Student | undefined {
    return this._students().find((s) => s.email.toLowerCase() === email.toLowerCase());
  }

  add(student: Student): void {
    this._students.update((list) => [student, ...list]);
    this.persist();
  }

  update(id: string, patch: Partial<Student>): void {
    this._students.update((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    this.persist();
  }

  remove(id: string): void {
    this._students.update((list) => list.filter((s) => s.id !== id));
    this.persist();
  }

  private persist(): void {
    writeJson(STORAGE_KEY, this._students());
  }
}
