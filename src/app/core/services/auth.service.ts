import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  AuthSession,
  AuthUser,
  ChangePasswordRequest,
  EducationalStage,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserRole,
} from '../../models';
import { readJson, writeJson, removeKey } from '../../shared/utils/local-store-sync';
import { decodeJwt } from '../utils/jwt.util';

const SESSION_KEY = 'auth_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Auth`;

  readonly currentUser = signal<AuthUser | null>(this.restoreSession()?.user ?? null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(email: string, password: string, rememberMe = false): Observable<AuthUser> {
    const body: LoginRequest = { email: email.trim(), password };
    return this.http.post<ApiResponse<TokenResponse>>(`${this.baseUrl}/login`, body).pipe(
      map((res) => this.handleTokenResponse(res, rememberMe)),
    );
  }

  registerStudent(payload: RegisterRequest): Observable<AuthUser> {
    return this.http.post<ApiResponse<TokenResponse>>(`${this.baseUrl}/register`, payload).pipe(
      map((res) => this.handleTokenResponse(res, true)),
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/change-password`, request);
  }

  refreshAccessToken(): Observable<AuthUser | null> {
    const session = readJson<AuthSession | null>(SESSION_KEY, null) ?? this.sessionFromSessionStorage();
    if (!session?.refreshToken) {
      this.logout();
      return new Observable((subscriber) => {
        subscriber.next(null);
        subscriber.complete();
      });
    }
    return this.http
      .post<ApiResponse<TokenResponse>>(`${this.baseUrl}/refresh-token`, {
        refreshToken: session.refreshToken,
      })
      .pipe(map((res) => this.handleTokenResponse(res, session.rememberMe)));
  }

  logout(): void {
    const session = readJson<AuthSession | null>(SESSION_KEY, null) ?? this.sessionFromSessionStorage();
    removeKey(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    this.currentUser.set(null);
    if (session?.refreshToken) {
      this.http
        .post(`${this.baseUrl}/revoke-token`, { refreshToken: session.refreshToken })
        .subscribe({ error: () => void 0 });
    }
  }

  getAccessToken(): string | null {
    const session = readJson<AuthSession | null>(SESSION_KEY, null) ?? this.sessionFromSessionStorage();
    return session?.accessToken ?? null;
  }

  private handleTokenResponse(res: ApiResponse<TokenResponse>, rememberMe: boolean): AuthUser {
    if (!res.success || !res.data) {
      throw new Error(res.message || 'حدث خطأ أثناء المصادقة');
    }
    const token = res.data;
    const claims = decodeJwt(token.accessToken);
    const role: UserRole = token.role === 'Admin' ? 'Admin' : 'Student';
    const stageClaim = claims?.['EducationalStage'];
    const user: AuthUser = {
      id: claims?.sub ?? '',
      email: token.email,
      role,
      name: token.fullName,
      stage: stageClaim ? (Number(stageClaim) as EducationalStage) : undefined,
    };
    const session: AuthSession = {
      user,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: new Date(token.expiration).getTime(),
      rememberMe,
    };
    this.persistSession(session);
    this.currentUser.set(user);
    return user;
  }

  private persistSession(session: AuthSession): void {
    if (session.rememberMe) {
      writeJson(SESSION_KEY, session);
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      removeKey(SESSION_KEY);
    }
  }

  private sessionFromSessionStorage(): AuthSession | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  }

  private restoreSession(): AuthSession | null {
    const fromLocal = readJson<AuthSession | null>(SESSION_KEY, null);
    const session = fromLocal ?? this.sessionFromSessionStorage();
    if (!session || session.expiresAt < Date.now()) {
      if (session) {
        removeKey(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
      return null;
    }
    return session;
  }
}
