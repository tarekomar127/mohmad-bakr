import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExamCard } from '../../../shared/components/exam-card/exam-card';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ExamsService } from '../../../services/exams.service';
import { Exam } from '../../../models';

@Component({
  selector: 'app-student-exams',
  imports: [ExamCard, EmptyState],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class StudentExams {
  private readonly examsService = inject(ExamsService);

  readonly exams = toSignal(this.examsService.getForCurrentStudent(), { initialValue: [] as Exam[] });
  readonly showComingSoon = signal(false);

  start(): void {
    this.showComingSoon.set(true);
    setTimeout(() => this.showComingSoon.set(false), 2500);
  }
}
