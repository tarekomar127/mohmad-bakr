import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LucideCircleCheck, LucideTrendingUp } from '@lucide/angular';
import { ChartWrapper } from '../../../shared/components/chart-wrapper/chart-wrapper';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ExamResultsService } from '../../../services/exam-results.service';
import { ExamResult } from '../../../models';

@Component({
  selector: 'app-student-results',
  imports: [ChartWrapper, EmptyState, LucideCircleCheck, LucideTrendingUp],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class StudentResults {
  private readonly examResultsService = inject(ExamResultsService);

  readonly results = toSignal(this.examResultsService.getAll({ pageSize: 100 }).pipe(map((res) => res.items)), {
    initialValue: [] as ExamResult[],
  });

  readonly sortedResults = computed(() =>
    [...this.results()].sort((a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime()),
  );

  readonly averagePercentage = computed(() => {
    const list = this.results();
    if (!list.length) return 0;
    return Math.round(list.reduce((sum, r) => sum + r.percentage, 0) / list.length);
  });

  readonly bestPercentage = computed(() => {
    const list = this.results();
    return list.length ? Math.max(...list.map((r) => r.percentage)) : 0;
  });

  readonly progressLabels = computed(() => this.sortedResults().map((r) => r.examTitle).reverse());
  readonly progressSeries = computed(() => [
    { label: 'النسبة المئوية', data: [...this.sortedResults()].reverse().map((r) => r.percentage) },
  ]);
}
