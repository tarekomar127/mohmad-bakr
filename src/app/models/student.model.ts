import { EducationalStage, Gender } from './api.model';

export interface Student {
  id: string;
  fullName: string;
  parentName: string;
  studentPhone: string;
  parentPhone: string;
  email: string;
  gender: Gender;
  genderName: string;
  governorate: string;
  city: string;
  educationalStage: EducationalStage;
  educationalStageName: string;
  createdAt: string;
}

export interface StudentUpdateDto {
  fullName: string;
  parentName: string;
  studentPhone: string;
  parentPhone: string;
  email: string;
  gender: Gender;
  governorate: string;
  city: string;
  educationalStage: EducationalStage;
}
