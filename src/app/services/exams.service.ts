import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  EducationalStage,
  Exam,
  ExamCreateDto,
  ExamResult,
  ExamSubmitDto,
  ExamUpdateDto,
  PagedResult,
} from '../models';

export interface ExamsQuery {
  search?: string;
  stage?: EducationalStage;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class ExamsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Exams`;

  getAll(query: ExamsQuery = {}): Observable<PagedResult<Exam>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber ?? 1)
      .set('pageSize', query.pageSize ?? 100);
    if (query.search) params = params.set('search', query.search);
    if (query.stage) params = params.set('stage', query.stage);

    return this.http.get<ApiResponse<PagedResult<Exam>>>(this.baseUrl, { params }).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Exam> {
    return this.http.get<ApiResponse<Exam>>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data));
  }

  create(dto: ExamCreateDto): Observable<Exam> {
    return this.http.post<ApiResponse<Exam>>(this.baseUrl, dto).pipe(map((res) => res.data));
  }

  update(id: string, dto: ExamUpdateDto): Observable<Exam> {
    return this.http.put<ApiResponse<Exam>>(`${this.baseUrl}/${id}`, dto).pipe(map((res) => res.data));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  submit(id: string, dto: ExamSubmitDto): Observable<ExamResult> {
    return this.http
      .post<ApiResponse<ExamResult>>(`${this.baseUrl}/${id}/submit`, dto)
      .pipe(map((res) => res.data));
  }
}
