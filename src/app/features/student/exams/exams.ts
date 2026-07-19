import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);

  readonly exams = toSignal(this.examsService.getAll({ pageSize: 100 }).pipe(map((res) => res.items)), {
    initialValue: [] as Exam[],
  });

  start(exam: Exam): void {
    this.router.navigate(['/student/exams', exam.id]);
  }
}
