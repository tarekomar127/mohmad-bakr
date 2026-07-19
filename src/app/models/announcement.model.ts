import { StageTarget } from './educational-stage.model';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetStage: StageTarget;
  publishDate: string;
  createdAt: string;
}
