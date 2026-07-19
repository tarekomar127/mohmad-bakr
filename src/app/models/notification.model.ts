import { EducationalStage } from './api.model';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  targetStage: EducationalStage | null;
  targetStageName: string | null;
  createdAt: string;
}

export interface NotificationCreateDto {
  title: string;
  message: string;
  targetStage: EducationalStage | null;
}
