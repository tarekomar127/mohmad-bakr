import { EducationalStage } from './educational-stage.model';

export interface DashboardStats {
  totalStudents: number;
  totalVideos: number;
  totalPdfs: number;
  totalExams: number;
  totalAnnouncements: number;
  activityRate: number;
}

export interface SeriesChartData {
  labels: string[];
  values: number[];
}

export interface StageDistributionItem {
  stage: EducationalStage;
  studentCount: number;
  videoCount: number;
  pdfCount: number;
  examCount: number;
}

export interface StudentRankEntry {
  studentId: string;
  studentName: string;
  averageScore: number;
  progressPercent: number;
}
