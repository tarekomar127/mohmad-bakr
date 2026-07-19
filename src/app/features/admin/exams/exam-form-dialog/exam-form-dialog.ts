import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal';
import { ALL_STAGES, ContentStatus, Exam, STAGE_LABELS } from '../../../../models';

export interface ExamFormResult {
  title: string;
  stage: (typeof ALL_STAGES)[number];
  questionCount: number;
  durationMinutes: number;
  totalMarks: number;
  status: ContentStatus;
}

@Component({
  selector: 'app-exam-form-dialog',
  imports: [Modal, ReactiveFormsModule],
  templateUrl: './exam-form-dialog.html',
  styleUrl: './exam-form-dialog.scss',
})
export class ExamFormDialog {
  private readonly dialogRef = inject(MatDialogRef<ExamFormDialog, ExamFormResult | undefined>);
  readonly existing = inject<Exam | null>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  readonly stages = ALL_STAGES;
  readonly stageLabels = STAGE_LABELS;

  readonly form = this.fb.group({
    title: [this.existing?.title ?? '', Validators.required],
    stage: [this.existing?.stage ?? ('' as (typeof ALL_STAGES)[number] | ''), Validators.required],
    questionCount: [this.existing?.questionCount ?? 10, [Validators.required, Validators.min(1)]],
    durationMinutes: [this.existing?.durationMinutes ?? 30, [Validators.required, Validators.min(1)]],
    totalMarks: [this.existing?.totalMarks ?? 10, [Validators.required, Validators.min(1)]],
    status: [this.existing?.status ?? ('draft' as ContentStatus), Validators.required],
  });

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({
      title: value.title!,
      stage: value.stage as (typeof ALL_STAGES)[number],
      questionCount: value.questionCount!,
      durationMinutes: value.durationMinutes!,
      totalMarks: value.totalMarks!,
      status: value.status as ContentStatus,
    });
  }
}
