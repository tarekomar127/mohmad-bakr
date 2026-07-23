import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal';
import { ExamsService } from '../../../../services/exams.service';
import { Exam, ExamResult, QuestionAnswer } from '../../../../models';

const OPTION_LABELS: Record<QuestionAnswer, string> = {
  [QuestionAnswer.A]: 'أ',
  [QuestionAnswer.B]: 'ب',
  [QuestionAnswer.C]: 'ج',
  [QuestionAnswer.D]: 'د',
};

@Component({
  selector: 'app-grade-dialog',
  imports: [Modal, FormsModule],
  templateUrl: './grade-dialog.html',
  styleUrl: './grade-dialog.scss',
})
export class GradeDialog {
  private readonly dialogRef = inject(MatDialogRef<GradeDialog, boolean | undefined>);
  private readonly examsService = inject(ExamsService);
  readonly result = inject<ExamResult>(MAT_DIALOG_DATA);

  readonly exam = signal<Exam | null>(null);
  readonly saving = signal(false);
  readonly scores = signal<Record<string, number>>({});

  readonly essayAnswers = computed(() => this.result.answers.filter((a) => a.questionType === 'Essay'));
  readonly mcqAnswers = computed(() => this.result.answers.filter((a) => a.questionType === 'MCQ'));
  readonly hasUngradedEssay = computed(() => this.essayAnswers().some((a) => !a.isGraded));

  constructor() {
    this.examsService.getById(this.result.examId).subscribe((exam) => {
      this.exam.set(exam);
      const initial: Record<string, number> = {};
      for (const a of this.essayAnswers()) initial[a.questionId] = a.score;
      this.scores.set(initial);
    });
  }

  questionText(questionId: string): string {
    return this.exam()?.questions.find((q) => q.id === questionId)?.text ?? '';
  }

  maxMarks(questionId: string): number {
    return this.exam()?.questions.find((q) => q.id === questionId)?.marks ?? 0;
  }

  optionLabel(value: QuestionAnswer | null): string {
    return value ? OPTION_LABELS[value] : '—';
  }

  isCorrect(questionId: string, selected: QuestionAnswer | null): boolean {
    return this.exam()?.questions.find((q) => q.id === questionId)?.correctAnswer === selected;
  }

  setScore(questionId: string, value: number): void {
    const max = this.maxMarks(questionId);
    const clamped = Math.min(Math.max(value, 0), max);
    this.scores.update((s) => ({ ...s, [questionId]: clamped }));
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.saving.set(true);
    const answers = this.essayAnswers()
      .filter((a) => !a.isGraded)
      .map((a) => ({
        questionId: a.questionId,
        score: this.scores()[a.questionId] ?? 0,
      }));
    this.examsService.gradeEssayAnswers(this.result.id, { answers }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: () => this.saving.set(false),
    });
  }
}
