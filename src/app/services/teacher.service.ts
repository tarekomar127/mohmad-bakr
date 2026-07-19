import { Injectable, signal } from '@angular/core';
import { TeacherProfile } from '../models';
import { MOCK_TEACHER } from '../mock-data';
import { readJson, writeJson } from '../shared/utils/local-store-sync';

const STORAGE_KEY = 'mock_teacher_profile';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private readonly _profile = signal<TeacherProfile>(readJson(STORAGE_KEY, MOCK_TEACHER));
  readonly profile = this._profile.asReadonly();

  update(patch: Partial<TeacherProfile>): void {
    this._profile.update((current) => ({ ...current, ...patch }));
    writeJson(STORAGE_KEY, this._profile());
  }
}
