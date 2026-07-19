import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, EducationalStage, Gender, PagedResult, Student, StudentUpdateDto } from '../models';

export interface StudentsQuery {
  search?: string;
  stage?: EducationalStage;
  gender?: Gender;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Students`;

  getAll(query: StudentsQuery = {}): Observable<PagedResult<Student>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber ?? 1)
      .set('pageSize', query.pageSize ?? 100);
    if (query.search) params = params.set('search', query.search);
    if (query.stage) params = params.set('stage', query.stage);
    if (query.gender) params = params.set('gender', query.gender);

    return this.http
      .get<ApiResponse<PagedResult<Student>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Student> {
    return this.http.get<ApiResponse<Student>>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data));
  }

  update(id: string, dto: StudentUpdateDto): Observable<Student> {
    return this.http.put<ApiResponse<Student>>(`${this.baseUrl}/${id}`, dto).pipe(map((res) => res.data));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
