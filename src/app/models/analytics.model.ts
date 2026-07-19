import { EducationalStage } from './api.model';

export interface DashboardStats {
  totalStudents: number;
  totalVideos: number;
  totalPdfs: number;
  totalExams: number;
  totalAnnouncements: number;
  totalNotifications: number;
}

export interface StageDistributionItem {
  stage: EducationalStage;
  studentCount: number;
}

export interface StudentRankEntry {
  studentId: string;
  studentName: string;
  averagePercentage: number;
  resultsCount: number;
}

export interface ScoreBucket {
  label: string;
  count: number;
}
