import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Announcement, AnnouncementCreateDto, ApiResponse, EducationalStage, PagedResult } from '../models';

export interface AnnouncementsQuery {
  search?: string;
  stage?: EducationalStage;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Announcements`;

  getAll(query: AnnouncementsQuery = {}): Observable<PagedResult<Announcement>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber ?? 1)
      .set('pageSize', query.pageSize ?? 100);
    if (query.search) params = params.set('search', query.search);
    if (query.stage) params = params.set('stage', query.stage);

    return this.http
      .get<ApiResponse<PagedResult<Announcement>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  create(dto: AnnouncementCreateDto): Observable<Announcement> {
    return this.http.post<ApiResponse<Announcement>>(this.baseUrl, dto).pipe(map((res) => res.data));
  }

  update(id: string, dto: AnnouncementCreateDto): Observable<Announcement> {
    return this.http.put<ApiResponse<Announcement>>(`${this.baseUrl}/${id}`, dto).pipe(map((res) => res.data));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
