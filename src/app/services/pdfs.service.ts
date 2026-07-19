import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, EducationalStage, PagedResult, PdfCreateDto, PdfFile, PdfUpdateDto } from '../models';

export interface PdfsQuery {
  search?: string;
  stage?: EducationalStage;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class PdfsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Pdfs`;

  getAll(query: PdfsQuery = {}): Observable<PagedResult<PdfFile>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber ?? 1)
      .set('pageSize', query.pageSize ?? 100);
    if (query.search) params = params.set('search', query.search);
    if (query.stage) params = params.set('stage', query.stage);

    return this.http.get<ApiResponse<PagedResult<PdfFile>>>(this.baseUrl, { params }).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<PdfFile> {
    return this.http.get<ApiResponse<PdfFile>>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data));
  }

  create(dto: PdfCreateDto): Observable<PdfFile> {
    return this.http.post<ApiResponse<PdfFile>>(this.baseUrl, dto).pipe(map((res) => res.data));
  }

  update(id: string, dto: PdfUpdateDto): Observable<PdfFile> {
    return this.http.put<ApiResponse<PdfFile>>(`${this.baseUrl}/${id}`, dto).pipe(map((res) => res.data));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadFile(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/upload`, form).pipe(map((res) => res.data));
  }
}
