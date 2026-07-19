import { EducationalStage } from './educational-stage.model';
import { ContentStatus } from './video.model';

export interface Exam {
  id: string;
  title: string;
  stage: EducationalStage;
  questionCount: number;
  durationMinutes: number;
  totalMarks: number;
  status: ContentStatus;
  createdAt: string;
}
