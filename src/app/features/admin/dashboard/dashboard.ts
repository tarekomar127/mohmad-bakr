import { Component, computed, inject } from '@angular/core';
import {
  LucideActivity,
  LucideClipboardList,
  LucideFileText,
  LucideLayers,
  LucideMegaphone,
  LucideUsers,
  LucideVideo,
} from '@lucide/angular';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { ChartWrapper } from '../../../shared/components/chart-wrapper/chart-wrapper';
import { AnalyticsService } from '../../../services/analytics.service';
import { STAGE_LABELS } from '../../../models';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatCard,
    ChartWrapper,
    LucideActivity,
    LucideClipboardList,
    LucideFileText,
    LucideLayers,
    LucideMegaphone,
    LucideUsers,
    LucideVideo,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly analytics = inject(AnalyticsService);
  readonly stageLabels = STAGE_LABELS;

  readonly studentActivitySeries = [{ label: 'الطلاب النشطون', data: this.analytics.studentActivity.values }];
  readonly averageScoresSeries = [{ label: 'متوسط الدرجات', data: this.analytics.averageScoresTrend.values }];
  readonly videoCompletionSeries = [{ label: 'نسبة الإكمال %', data: this.analytics.videoCompletion.values }];

  readonly topStudentsSeries = computed(() => [
    {
      label: 'متوسط الدرجات',
      data: this.analytics.topStudents().map((s) => s.averageScore),
    },
  ]);
  readonly topStudentsLabels = computed(() => this.analytics.topStudents().map((s) => s.studentName));
}
