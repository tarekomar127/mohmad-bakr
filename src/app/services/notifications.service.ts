import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, AppNotification, EducationalStage, NotificationCreateDto, PagedResult } from '../models';

export interface NotificationsQuery {
  search?: string;
  stage?: EducationalStage;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Notifications`;

  getAll(query: NotificationsQuery = {}): Observable<PagedResult<AppNotification>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber ?? 1)
      .set('pageSize', query.pageSize ?? 100);
    if (query.search) params = params.set('search', query.search);
    if (query.stage) params = params.set('stage', query.stage);

    return this.http
      .get<ApiResponse<PagedResult<AppNotification>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  send(dto: NotificationCreateDto): Observable<AppNotification> {
    return this.http.post<ApiResponse<AppNotification>>(this.baseUrl, dto).pipe(map((res) => res.data));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
