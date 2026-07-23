import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, CreateUnitRequest, StageNode, UnitNode } from '../models';

@Injectable({ providedIn: 'root' })
export class StructureService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Videos`;

  private readonly _stages = signal<StageNode[]>([]);
  readonly stages = this._stages.asReadonly();

  load(): Observable<StageNode[]> {
    return this.http.get<ApiResponse<StageNode[]>>(`${this.baseUrl}/structure`).pipe(
      map((res) => res.data ?? []),
      tap((stages) => this._stages.set(stages)),
    );
  }

  createUnit(request: CreateUnitRequest): Observable<UnitNode> {
    return this.http
      .post<ApiResponse<UnitNode>>(`${this.baseUrl}/units`, request)
      .pipe(map((res) => res.data));
  }

  removeUnit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/units/${id}`);
  }
}
