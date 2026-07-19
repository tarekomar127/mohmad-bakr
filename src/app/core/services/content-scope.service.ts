import { Injectable, inject } from '@angular/core';
import { StageTarget } from '../../models';
import { AuthService } from './auth.service';

/**
 * The single place that enforces "a student only ever sees content tagged for
 * their own educational stage (or 'all')". Every student-facing entity service
 * must filter its lists through this method rather than re-implementing the rule.
 * `stageOf` accounts for the field being named differently across models
 * (`stage` on Video/PdfFile/Exam, `targetStage` on Announcement/AppNotification).
 */
@Injectable({ providedIn: 'root' })
export class ContentScopeService {
  private readonly auth = inject(AuthService);

  scopeToCurrentStudent<T>(items: T[], stageOf: (item: T) => StageTarget): T[] {
    const user = this.auth.currentUser();
    if (!user || user.role !== 'student' || !user.stage) {
      return items;
    }
    const stage = user.stage;
    return items.filter((item) => {
      const itemStage = stageOf(item);
      return itemStage === 'all' || itemStage === stage;
    });
  }
}
