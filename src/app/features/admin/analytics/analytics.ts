import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideTrendingDown, LucideTrendingUp } from '@lucide/angular';
import { ChartWrapper } from '../../../shared/components/chart-wrapper/chart-wrapper';
import { DashboardService } from '../../../services/dashboard.service';
import { STAGE_LABELS, StageDistributionItem, StudentRankEntry } from '../../../models';

@Component({
  selector: 'app-analytics',
  imports: [ChartWrapper, LucideTrendingDown, LucideTrendingUp],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  private readonly dashboardService = inject(DashboardService);
  readonly stageLabels = STAGE_LABELS;

  readonly stageDistribution = toSignal(this.dashboardService.getStageDistribution(), {
    initialValue: [] as StageDistributionItem[],
  });
  readonly stageDistributionLabels = computed(() => this.stageDistribution().map((s) => this.stageLabels[s.stage]));
  readonly stageDistributionSeries = computed(() => [
    { label: 'عدد الطلاب', data: this.stageDistribution().map((s) => s.studentCount) },
  ]);

  readonly performance = toSignal(this.dashboardService.getStudentPerformance(), {
    initialValue: { topStudents: [] as StudentRankEntry[], weakStudents: [] as StudentRankEntry[], scoreDistribution: [] },
  });

  readonly topStudents = computed(() => this.performance().topStudents);
  readonly weakStudents = computed(() => this.performance().weakStudents);

  readonly scoreDistributionLabels = computed(() => this.performance().scoreDistribution.map((b) => b.label));
  readonly scoreDistributionSeries = computed(() => [
    { label: 'عدد النتائج', data: this.performance().scoreDistribution.map((b) => b.count) },
  ]);
}
