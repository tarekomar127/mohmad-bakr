import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthSession, AuthUser, EducationalStage, MockCredential, Student } from '../../models';
import { MOCK_CREDENTIALS, MOCK_TEACHER } from '../../mock-data';
import { readJson, writeJson, removeKey } from '../../shared/utils/local-store-sync';
import { StudentsService } from '../../services/students.service';

const SESSION_KEY = 'auth_session';
const EXTRA_CREDENTIALS_KEY = 'mock_extra_credentials';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export interface SignupPayload {
  studentName: string;
  parentName: string;
  studentPhone: string;
  parentPhone: string;
  stage: EducationalStage;
  gender: 'male' | 'female';
  governorate: string;
  city: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly studentsService = inject(StudentsService);

  readonly currentUser = signal<AuthUser | null>(this.restoreSession());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(email: string, password: string, rememberMe = false): Observable<AuthUser> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const credential = this.allCredentials().find(
          (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password,
        );
        if (!credential) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        const user = this.resolveUser(credential);
        this.persistSession(user, rememberMe);
        this.currentUser.set(user);
        return user;
      }),
    );
  }

  registerStudent(payload: SignupPayload): Observable<AuthUser> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const existing = this.allCredentials().find(
          (c) => c.email.toLowerCase() === payload.email.trim().toLowerCase(),
        );
        if (existing) {
          throw new Error('يوجد حساب مسجل بالفعل بهذا البريد الإلكتروني');
        }

        const id = `stu-${Date.now()}`;
        const newStudent: Student = {
          id,
          studentName: payload.studentName,
          parentName: payload.parentName,
          studentPhone: payload.studentPhone,
          parentPhone: payload.parentPhone,
          email: payload.email,
          stage: payload.stage,
          gender: payload.gender,
          governorate: payload.governorate,
          city: payload.city,
          status: 'active',
          progressPercent: 0,
          averageScore: 0,
          completedLessons: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        this.studentsService.add(newStudent);

        const newCredential: MockCredential = {
          email: payload.email,
          password: payload.password,
          userId: id,
          role: 'student',
        };
        const extra = readJson<MockCredential[]>(EXTRA_CREDENTIALS_KEY, []);
        writeJson(EXTRA_CREDENTIALS_KEY, [...extra, newCredential]);

        const user = this.resolveUser(newCredential);
        this.persistSession(user, true);
        this.currentUser.set(user);
        return user;
      }),
    );
  }

  logout(): void {
    removeKey(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    this.currentUser.set(null);
  }

  private allCredentials(): MockCredential[] {
    return [...MOCK_CREDENTIALS, ...readJson<MockCredential[]>(EXTRA_CREDENTIALS_KEY, [])];
  }

  private resolveUser(credential: MockCredential): AuthUser {
    if (credential.role === 'admin') {
      return {
        id: MOCK_TEACHER.id,
        email: credential.email,
        role: 'admin',
        name: MOCK_TEACHER.name,
        avatarUrl: MOCK_TEACHER.profileImageUrl,
      };
    }
    const student = this.studentsService.getById(credential.userId);
    if (!student) {
      throw new Error('تعذر العثور على بيانات الطالب');
    }
    return {
      id: student.id,
      email: student.email,
      role: 'student',
      name: student.studentName,
      stage: student.stage,
      avatarUrl: student.avatarUrl,
    };
  }

  private persistSession(user: AuthUser, rememberMe: boolean): void {
    const session: AuthSession = {
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
      expiresAt: Date.now() + SESSION_TTL_MS,
      rememberMe,
    };
    if (rememberMe) {
      writeJson(SESSION_KEY, session);
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      removeKey(SESSION_KEY);
    }
  }

  private restoreSession(): AuthUser | null {
    const fromLocal = readJson<AuthSession | null>(SESSION_KEY, null);
    const fromSession = (() => {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as AuthSession) : null;
      } catch {
        return null;
      }
    })();
    const session = fromLocal ?? fromSession;
    if (!session || session.expiresAt < Date.now()) {
      if (session) {
        removeKey(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
      return null;
    }
    return session.user;
  }
}
