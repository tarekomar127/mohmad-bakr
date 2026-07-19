import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal';
import { ALL_STAGES, STAGE_LABELS, StageTarget } from '../../../../models';

export interface AnnouncementFormResult {
  title: string;
  content: string;
  targetStage: StageTarget;
  publishDate: string;
}

@Component({
  selector: 'app-announcement-form-dialog',
  imports: [Modal, ReactiveFormsModule],
  templateUrl: './announcement-form-dialog.html',
  styleUrl: './announcement-form-dialog.scss',
})
export class AnnouncementFormDialog {
  private readonly dialogRef = inject(MatDialogRef<AnnouncementFormDialog, AnnouncementFormResult | undefined>);
  private readonly fb = inject(FormBuilder);

  readonly stages = ALL_STAGES;
  readonly stageLabels = STAGE_LABELS;

  readonly form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    targetStage: ['all' as StageTarget, Validators.required],
    publishDate: [new Date().toISOString().slice(0, 10), Validators.required],
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
      content: value.content!,
      targetStage: value.targetStage as StageTarget,
      publishDate: value.publishDate!,
    });
  }
}
