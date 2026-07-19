import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideFileText, LucideUpload } from '@lucide/angular';
import { Modal } from '../../../../shared/components/modal/modal';
import { ALL_STAGES, PdfFile, STAGE_LABELS } from '../../../../models';

export interface PdfFormResult {
  title: string;
  description: string;
  stage: (typeof ALL_STAGES)[number];
  fileUrl: string;
}

@Component({
  selector: 'app-pdf-form-dialog',
  imports: [Modal, ReactiveFormsModule, LucideFileText, LucideUpload],
  templateUrl: './pdf-form-dialog.html',
  styleUrl: './pdf-form-dialog.scss',
})
export class PdfFormDialog {
  private readonly dialogRef = inject(MatDialogRef<PdfFormDialog, PdfFormResult | undefined>);
  readonly existing = inject<PdfFile | null>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  readonly stages = ALL_STAGES;
  readonly stageLabels = STAGE_LABELS;
  readonly fileName = signal<string>(this.existing ? 'ملف مرفوع مسبقًا.pdf' : '');

  readonly form = this.fb.group({
    title: [this.existing?.title ?? '', Validators.required],
    description: [this.existing?.description ?? '', Validators.required],
    stage: [this.existing?.stage ?? ('' as (typeof ALL_STAGES)[number] | ''), Validators.required],
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.fileName.set(file.name);
    }
  }

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
      stage: value.stage as (typeof ALL_STAGES)[number],
      fileUrl: this.fileName(),
    });
  }
}
