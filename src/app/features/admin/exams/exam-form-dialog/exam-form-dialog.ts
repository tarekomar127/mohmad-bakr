import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucidePlus, LucideTrash2 } from '@lucide/angular';
import { Modal } from '../../../../shared/components/modal/modal';
import { Exam, ExamCreateDto, QuestionAnswer, StageNode, TermNode, UnitNode } from '../../../../models';
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
  readonly selectedStageId = signal('');
  readonly selectedTermId = signal('');

  readonly terms = computed<TermNode[]>(
    () => this.stages().find((s: StageNode) => s.id === this.selectedStageId())?.terms ?? [],
  );
  readonly units = computed<UnitNode[]>(
    () => this.terms().find((t) => t.id === this.selectedTermId())?.units ?? [],
  );

  readonly form = this.fb.group({
    title: [this.existing?.title ?? '', Validators.required],
    lessonId: [this.existing?.lessonId ?? '', Validators.required],
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

  private buildQuestion(existing?: {
    text: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: QuestionAnswer;
  }) {
    return this.fb.group({
      text: [existing?.text ?? '', Validators.required],
      optionA: [existing?.optionA ?? '', Validators.required],
      optionB: [existing?.optionB ?? '', Validators.required],
      optionC: [existing?.optionC ?? '', Validators.required],
      optionD: [existing?.optionD ?? '', Validators.required],
      correctAnswer: [existing?.correctAnswer ?? QuestionAnswer.A, Validators.required],
    });
  }

  addQuestion(): void {
    this.questions.push(this.buildQuestion());
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  onStageChange(id: string): void {
    this.selectedStageId.set(id);
    this.selectedTermId.set('');
    this.form.patchValue({ lessonId: '' });
  }

  onTermChange(id: string): void {
    this.selectedTermId.set(id);
    this.form.patchValue({ lessonId: '' });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid || this.questions.length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue() as ExamCreateDto);
  }
}
