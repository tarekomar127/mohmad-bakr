import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { DashboardService } from '../../../services/dashboard.service';
import { DashboardStats, STAGE_LABELS, StageDistributionItem, StudentRankEntry } from '../../../models';

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
  private readonly dashboardService = inject(DashboardService);
  readonly stageLabels = STAGE_LABELS;

  readonly stats = toSignal(this.dashboardService.getStats(), {
    initialValue: {
      totalStudents: 0,
      totalVideos: 0,
      totalPdfs: 0,
      totalExams: 0,
      totalAnnouncements: 0,
      totalNotifications: 0,
    } as DashboardStats,
  });

  readonly stageDistribution = toSignal(this.dashboardService.getStageDistribution(), {
    initialValue: [] as StageDistributionItem[],
  });

  readonly performance = toSignal(this.dashboardService.getStudentPerformance(), {
    initialValue: { topStudents: [] as StudentRankEntry[], weakStudents: [] as StudentRankEntry[], scoreDistribution: [] },
  });

  readonly topStudentsLabels = computed(() => this.performance().topStudents.map((s) => s.studentName));
  readonly topStudentsSeries = computed(() => [
    { label: 'متوسط النتائج', data: this.performance().topStudents.map((s) => s.averagePercentage) },
  ]);

  readonly scoreDistributionLabels = computed(() => this.performance().scoreDistribution.map((b) => b.label));
  readonly scoreDistributionSeries = computed(() => [
    { label: 'عدد الطلاب', data: this.performance().scoreDistribution.map((b) => b.count) },
  ]);
}
