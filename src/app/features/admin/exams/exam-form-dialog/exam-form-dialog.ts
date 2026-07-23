import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucidePlus, LucideTrash2 } from '@lucide/angular';
import { Modal } from '../../../../shared/components/modal/modal';
import {
  Exam,
  ExamCreateDto,
  Question,
  QuestionAnswer,
  QuestionCreateDto,
  QuestionType,
  StageNode,
  TermNode,
  UnitNode,
} from '../../../../models';
import { StructureService } from '../../../../services/structure.service';

@Component({
  selector: 'app-exam-form-dialog',
  imports: [Modal, ReactiveFormsModule, FormsModule, LucidePlus, LucideTrash2],
  templateUrl: './exam-form-dialog.html',
  styleUrl: './exam-form-dialog.scss',
})
export class ExamFormDialog {
  private readonly dialogRef = inject(MatDialogRef<ExamFormDialog, ExamCreateDto | undefined>);
  readonly existing = inject<Exam | null>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly structureService = inject(StructureService);

  readonly stages = this.structureService.stages;
  readonly selectedStageId = signal(this.existing?.educationalStageId ?? '');
  readonly selectedTermId = signal(this.existing?.termId ?? '');
  readonly mcqValidationError = signal(false);

  readonly terms = computed<TermNode[]>(
    () => this.stages().find((s: StageNode) => s.id === this.selectedStageId())?.terms ?? [],
  );
  readonly units = computed<UnitNode[]>(
    () => this.terms().find((t) => t.id === this.selectedTermId())?.units ?? [],
  );

  readonly form = this.fb.group({
    title: [this.existing?.title ?? '', Validators.required],
    unitId: [this.existing?.unitId ?? '', Validators.required],
    duration: [this.existing?.duration ?? 30, [Validators.required, Validators.min(1)]],
    totalMarks: [this.existing?.totalMarks ?? 10, [Validators.required, Validators.min(1)]],
    questions: this.fb.array(
      (this.existing?.questions ?? []).map((q) => this.buildQuestion(q)),
    ),
  });

  constructor() {
    this.structureService.load().subscribe();
    if (this.questions.length === 0) {
      this.addQuestion();
    }
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  private buildQuestion(existing?: Question | QuestionCreateDto) {
    return this.fb.group({
      text: [existing?.text ?? '', Validators.required],
      questionType: [(existing?.questionType ?? 'MCQ') as QuestionType, Validators.required],
      marks: [existing?.marks ?? 1, [Validators.required, Validators.min(1)]],
      optionA: [existing?.optionA ?? ''],
      optionB: [existing?.optionB ?? ''],
      optionC: [existing?.optionC ?? ''],
      optionD: [existing?.optionD ?? ''],
      correctAnswer: [existing?.correctAnswer ?? QuestionAnswer.A],
    });
  }

  addQuestion(): void {
    this.questions.push(this.buildQuestion());
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  setQuestionType(index: number, type: QuestionType): void {
    this.questions.at(index).patchValue({ questionType: type });
  }

  onStageChange(id: string): void {
    this.selectedStageId.set(id);
    this.selectedTermId.set('');
    this.form.patchValue({ unitId: '' });
  }

  onTermChange(id: string): void {
    this.selectedTermId.set(id);
    this.form.patchValue({ unitId: '' });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.mcqValidationError.set(false);
    if (this.form.invalid || this.questions.length === 0 || !this.selectedStageId() || !this.selectedTermId()) {
      this.form.markAllAsTouched();
      return;
    }
    const rawQuestions = this.questions.getRawValue() as Array<{
      text: string;
      questionType: QuestionType;
      marks: number;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: QuestionAnswer;
    }>;
    const mcqIncomplete = rawQuestions.some(
      (q) => q.questionType === 'MCQ' && (!q.optionA || !q.optionB || !q.optionC || !q.optionD),
    );
    if (mcqIncomplete) {
      this.mcqValidationError.set(true);
      return;
    }

    const questions: QuestionCreateDto[] = rawQuestions.map((q) => ({
      text: q.text,
      questionType: q.questionType,
      marks: q.marks,
      optionA: q.questionType === 'MCQ' ? q.optionA : null,
      optionB: q.questionType === 'MCQ' ? q.optionB : null,
      optionC: q.questionType === 'MCQ' ? q.optionC : null,
      optionD: q.questionType === 'MCQ' ? q.optionD : null,
      correctAnswer: q.questionType === 'MCQ' ? q.correctAnswer : null,
    }));

    const value = this.form.getRawValue();
    this.dialogRef.close({
      title: value.title!,
      educationalStageId: this.selectedStageId(),
      termId: this.selectedTermId(),
      unitId: value.unitId!,
      duration: value.duration!,
      totalMarks: value.totalMarks!,
      questions,
    });
  }
}
