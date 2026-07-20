import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
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
  private readonly destroyRef = inject(DestroyRef);

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

  readonly remainingSeconds = signal(0);
  readonly timerDisplay = computed(() => {
    const total = this.remainingSeconds();
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  });
  readonly timerLow = computed(() => this.remainingSeconds() > 0 && this.remainingSeconds() <= 120);
  private timerHandle: ReturnType<typeof setInterval> | null = null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.examsService.getById(id).subscribe({
      next: (exam) => {
        this.exam.set(exam);
        this.loading.set(false);
        this.startTimer(exam.duration * 60);
      },
      error: () => this.loading.set(false),
    });
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  private startTimer(seconds: number): void {
    this.remainingSeconds.set(seconds);
    this.timerHandle = setInterval(() => {
      const next = this.remainingSeconds() - 1;
      if (next <= 0) {
        this.remainingSeconds.set(0);
        this.stopTimer();
        this.submit(true);
      } else {
        this.remainingSeconds.set(next);
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
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

  submit(forced = false): void {
    const exam = this.exam();
    if (!exam || (!forced && !this.allAnswered())) return;
    this.stopTimer();
    this.submitting.set(true);
    this.examsService
      .submit(exam.id, {
        answers: exam.questions
          .filter((q) => this.answers()[q.id] !== undefined)
          .map((q) => ({ questionId: q.id, selectedAnswer: this.answers()[q.id] })),
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
