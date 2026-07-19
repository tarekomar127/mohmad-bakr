import { EducationalStage } from './educational-stage.model';

export type StudentGender = 'male' | 'female';
export type StudentStatus = 'active' | 'inactive' | 'suspended';

export interface Student {
  id: string;
  studentName: string;
  parentName: string;
  studentPhone: string;
  parentPhone: string;
  email: string;
  stage: EducationalStage;
  gender: StudentGender;
  governorate: string;
  city: string;
  status: StudentStatus;
  progressPercent: number;
  averageScore: number;
  completedLessons: number;
  createdAt: string;
  avatarUrl?: string;
}
