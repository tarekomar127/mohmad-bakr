import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, EducationalStage, PagedResult, Video, VideoCreateDto, VideoUpdateDto } from '../models';

export interface VideosQuery {
  search?: string;
  stage?: EducationalStage;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class VideosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Videos`;

  getAll(query: VideosQuery = {}): Observable<PagedResult<Video>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber ?? 1)
      .set('pageSize', query.pageSize ?? 100);
    if (query.search) params = params.set('search', query.search);
    if (query.stage) params = params.set('stage', query.stage);

    return this.http.get<ApiResponse<PagedResult<Video>>>(this.baseUrl, { params }).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Video> {
    return this.http.get<ApiResponse<Video>>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data));
  }

  create(dto: VideoCreateDto): Observable<Video> {
    return this.http.post<ApiResponse<Video>>(this.baseUrl, dto).pipe(map((res) => res.data));
  }

  update(id: string, dto: VideoUpdateDto): Observable<Video> {
    return this.http.put<ApiResponse<Video>>(`${this.baseUrl}/${id}`, dto).pipe(map((res) => res.data));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadFile(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}/upload`, form)
      .pipe(map((res) => res.data));
  }
}
