import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, ExamResult, PagedResult } from '../models';

export interface ExamResultsQuery {
  examId?: string;
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class ExamResultsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Results`;

  getAll(query: ExamResultsQuery = {}): Observable<PagedResult<ExamResult>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber ?? 1)
      .set('pageSize', query.pageSize ?? 100);
    if (query.examId) params = params.set('examId', query.examId);
    if (query.search) params = params.set('search', query.search);

    return this.http
      .get<ApiResponse<PagedResult<ExamResult>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }
}
