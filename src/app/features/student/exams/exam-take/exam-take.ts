import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideCheck, LucideClipboardList, LucideClock } from '@lucide/angular';
import { ExamsService } from '../../../../services/exams.service';
import { Exam, ExamResult, Question, QuestionAnswer } from '../../../../models';

interface AnswerOption {
  label: string;
  value: QuestionAnswer;
}

@Component({
  selector: 'app-exam-take',
  imports: [LucideCheck, LucideClipboardList, LucideClock],
  templateUrl: './exam-take.html',
  styleUrl: './exam-take.scss',
})
export class ExamTake {
  private readonly examsService = inject(ExamsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly exam = signal<Exam | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly result = signal<ExamResult | null>(null);
  readonly answers = signal<Record<string, QuestionAnswer>>({});

  readonly answeredCount = computed(() => Object.keys(this.answers()).length);
  readonly allAnswered = computed(() => {
    const exam = this.exam();
    return !!exam && exam.questions.length > 0 && this.answeredCount() === exam.questions.length;
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.examsService.getById(id).subscribe({
      next: (exam) => {
        this.exam.set(exam);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  optionsFor(q: Question): AnswerOption[] {
    return [
      { label: q.optionA, value: QuestionAnswer.A },
      { label: q.optionB, value: QuestionAnswer.B },
      { label: q.optionC, value: QuestionAnswer.C },
      { label: q.optionD, value: QuestionAnswer.D },
    ];
  }

  select(questionId: string, answer: QuestionAnswer): void {
    this.answers.update((current) => ({ ...current, [questionId]: answer }));
  }

  submit(): void {
    const exam = this.exam();
    if (!exam || !this.allAnswered()) return;
    this.submitting.set(true);
    this.examsService
      .submit(exam.id, {
        answers: exam.questions.map((q) => ({ questionId: q.id, selectedAnswer: this.answers()[q.id] })),
      })
      .subscribe({
        next: (result) => {
          this.result.set(result);
          this.submitting.set(false);
        },
        error: () => this.submitting.set(false),
      });
  }

  backToExams(): void {
    this.router.navigate(['/student/exams']);
  }

  viewResults(): void {
    this.router.navigate(['/student/results']);
  }
}
