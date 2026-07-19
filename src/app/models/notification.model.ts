import { StageTarget } from './educational-stage.model';

export type NotificationKind = 'exam' | 'holiday' | 'video' | 'pdf' | 'general';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  targetStage: StageTarget;
  kind: NotificationKind;
  sentAt: string;
}
