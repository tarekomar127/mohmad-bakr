import { EducationalStage } from './educational-stage.model';

export type ContentStatus = 'published' | 'draft';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  stage: EducationalStage;
  lessonName: string;
  durationMinutes: number;
  status: ContentStatus;
  teacherName: string;
  createdAt: string;
  watchCount: number;
}

export interface VideoProgress {
  studentId: string;
  videoId: string;
  progressPercent: number;
  completed: boolean;
}
