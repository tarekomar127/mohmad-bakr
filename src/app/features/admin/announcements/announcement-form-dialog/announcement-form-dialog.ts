import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal';
import { ALL_STAGES, AnnouncementCreateDto, EducationalStage, STAGE_LABELS } from '../../../../models';

@Component({
  selector: 'app-announcement-form-dialog',
  imports: [Modal, ReactiveFormsModule],
  templateUrl: './announcement-form-dialog.html',
  styleUrl: './announcement-form-dialog.scss',
})
export class AnnouncementFormDialog {
  private readonly dialogRef = inject(MatDialogRef<AnnouncementFormDialog, AnnouncementCreateDto | undefined>);
  private readonly fb = inject(FormBuilder);

  readonly stages = ALL_STAGES;
  readonly stageLabels = STAGE_LABELS;

  readonly form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    targetStage: [null as EducationalStage | null],
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
      description: value.description!,
      targetStage: value.targetStage,
    });
  }
}
