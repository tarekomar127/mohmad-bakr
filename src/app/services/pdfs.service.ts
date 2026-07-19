import { Injectable, inject, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { PdfFile } from '../models';
import { MOCK_PDFS } from '../mock-data';
import { readJson, writeJson } from '../shared/utils/local-store-sync';
import { ContentScopeService } from '../core/services/content-scope.service';

const STORAGE_KEY = 'mock_pdfs';

@Injectable({ providedIn: 'root' })
export class PdfsService {
  private readonly scope = inject(ContentScopeService);
  private readonly _pdfs = signal<PdfFile[]>(readJson(STORAGE_KEY, MOCK_PDFS));
  readonly pdfs = this._pdfs.asReadonly();

  getAll(): Observable<PdfFile[]> {
    return of(this._pdfs()).pipe(delay(300));
  }

  getForCurrentStudent(): Observable<PdfFile[]> {
    return of(this.scope.scopeToCurrentStudent(this._pdfs(), (p) => p.stage)).pipe(delay(300));
  }

  getById(id: string): PdfFile | undefined {
    return this._pdfs().find((p) => p.id === id);
  }

  add(pdf: PdfFile): void {
    this._pdfs.update((list) => [pdf, ...list]);
    this.persist();
  }

  update(id: string, patch: Partial<PdfFile>): void {
    this._pdfs.update((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    this.persist();
  }

  remove(id: string): void {
    this._pdfs.update((list) => list.filter((p) => p.id !== id));
    this.persist();
  }

  private persist(): void {
    writeJson(STORAGE_KEY, this._pdfs());
  }
}
