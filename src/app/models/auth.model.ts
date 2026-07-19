import { EducationalStage } from './educational-stage.model';

export type UserRole = 'admin' | 'student';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  stage?: EducationalStage;
  avatarUrl?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number;
  rememberMe: boolean;
}

/**
 * Mock-only credential record. Plaintext passwords are acceptable here ONLY because
 * this is a frontend-only demo with no real backend/user data — never do this in production.
 */
export interface MockCredential {
  email: string;
  password: string;
  userId: string;
  role: UserRole;
}
