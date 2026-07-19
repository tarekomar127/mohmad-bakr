import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, TeacherProfile, TeacherProfileUpdateDto } from '../models';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Teacher`;

  private readonly _profile = signal<TeacherProfile | null>(null);
  readonly profile = this._profile.asReadonly();

  load(): Observable<TeacherProfile> {
    return this.http.get<ApiResponse<TeacherProfile>>(this.baseUrl).pipe(
      map((res) => res.data),
      tap((profile) => this._profile.set(profile)),
    );
  }

  update(dto: TeacherProfileUpdateDto): Observable<TeacherProfile> {
    return this.http.put<ApiResponse<TeacherProfile>>(this.baseUrl, dto).pipe(
      map((res) => res.data),
      tap((profile) => this._profile.set(profile)),
    );
  }

  uploadProfileImage(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}/upload-profile-image`, form)
      .pipe(map((res) => res.data));
  }

  uploadGalleryImages(files: File[]): Observable<string[]> {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    return this.http
      .post<ApiResponse<string[]>>(`${this.baseUrl}/upload-gallery`, form)
      .pipe(map((res) => res.data));
  }
}
