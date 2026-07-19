import { Component, inject } from '@angular/core';
import { LucideTrendingDown, LucideTrendingUp } from '@lucide/angular';
import { ChartWrapper } from '../../../shared/components/chart-wrapper/chart-wrapper';
import { AnalyticsService } from '../../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  imports: [ChartWrapper, LucideTrendingDown, LucideTrendingUp],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  readonly analytics = inject(AnalyticsService);

  readonly videoCompletionSeries = [{ label: 'نسبة الإكمال %', data: this.analytics.videoCompletion.values }];
  readonly averageScoresSeries = [{ label: 'متوسط الدرجات', data: this.analytics.averageScoresTrend.values }];
  readonly watchTimeSeries = [{ label: 'دقائق المشاهدة', data: this.analytics.watchTime.values }];
  readonly pdfDownloadsSeries = [{ label: 'عدد التحميلات', data: this.analytics.pdfDownloads.values }];
  readonly examDistributionSeries = [{ label: 'عدد الطلاب', data: this.analytics.examResultDistribution.values }];

  readonly topStudents = this.analytics.topStudents;
  readonly weakStudents = this.analytics.weakStudents;
}
