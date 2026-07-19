import { EducationalStage } from './api.model';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  targetStage: EducationalStage | null;
  targetStageName: string | null;
  createdAt: string;
}

export interface AnnouncementCreateDto {
  title: string;
  description: string;
  targetStage: EducationalStage | null;
}
