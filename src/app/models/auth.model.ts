import { EducationalStage, Gender } from './api.model';

export type UserRole = 'Admin' | 'Student';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  stage?: EducationalStage;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  rememberMe: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  parentName: string;
  studentPhone: string;
  parentPhone: string;
  email: string;
  password: string;
  gender: Gender;
  governorate: string;
  city: string;
  educationalStage: EducationalStage;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiration: string;
  role: string;
  fullName: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
