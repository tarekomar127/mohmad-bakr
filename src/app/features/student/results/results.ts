import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideCircleCheck, LucideCircleX, LucideTrendingUp } from '@lucide/angular';
import { ChartWrapper } from '../../../shared/components/chart-wrapper/chart-wrapper';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ExamResultsService } from '../../../services/exam-results.service';
import { ExamResult } from '../../../models';

@Component({
  selector: 'app-student-results',
  imports: [ChartWrapper, EmptyState, LucideCircleCheck, LucideTrendingUp, LucideCircleX],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class StudentResults {
  private readonly examResultsService = inject(ExamResultsService);

  readonly results = toSignal(this.examResultsService.getForCurrentStudent(), { initialValue: [] as ExamResult[] });

  readonly sortedResults = computed(() =>
    [...this.results()].sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()),
  );

  readonly averagePercentage = computed(() => {
    const list = this.results();
    if (!list.length) return 0;
    return Math.round(list.reduce((sum, r) => sum + r.percentage, 0) / list.length);
  });

  readonly totalCorrect = computed(() => this.results().reduce((sum, r) => sum + r.correctCount, 0));
  readonly totalWrong = computed(() => this.results().reduce((sum, r) => sum + r.wrongCount, 0));

  readonly progressLabels = computed(() => this.sortedResults().map((r) => r.examTitle).reverse());
  readonly progressSeries = computed(() => [
    { label: 'النسبة المئوية', data: [...this.sortedResults()].reverse().map((r) => r.percentage) },
  ]);
}
