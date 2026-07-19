import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideUpload } from '@lucide/angular';
import { Modal } from '../../../../shared/components/modal/modal';
import { ALL_STAGES, ContentStatus, STAGE_LABELS, Video } from '../../../../models';

export interface VideoFormResult {
  title: string;
  description: string;
  thumbnailUrl: string;
  stage: (typeof ALL_STAGES)[number];
  lessonName: string;
  durationMinutes: number;
  status: ContentStatus;
}

@Component({
  selector: 'app-video-form-dialog',
  imports: [Modal, ReactiveFormsModule, LucideUpload],
  templateUrl: './video-form-dialog.html',
  styleUrl: './video-form-dialog.scss',
})
export class VideoFormDialog {
  private readonly dialogRef = inject(MatDialogRef<VideoFormDialog, VideoFormResult | undefined>);
  readonly existing = inject<Video | null>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  readonly stages = ALL_STAGES;
  readonly stageLabels = STAGE_LABELS;
  readonly thumbnailPreview = signal<string>(this.existing?.thumbnailUrl ?? '');

  readonly form = this.fb.group({
    title: [this.existing?.title ?? '', Validators.required],
    description: [this.existing?.description ?? '', Validators.required],
    stage: [this.existing?.stage ?? ('' as (typeof ALL_STAGES)[number] | ''), Validators.required],
    lessonName: [this.existing?.lessonName ?? '', Validators.required],
    durationMinutes: [this.existing?.durationMinutes ?? 20, [Validators.required, Validators.min(1)]],
    status: [this.existing?.status ?? ('draft' as ContentStatus), Validators.required],
  });

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.thumbnailPreview.set(URL.createObjectURL(file));
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
      thumbnailUrl: this.thumbnailPreview(),
      stage: value.stage as (typeof ALL_STAGES)[number],
      lessonName: value.lessonName!,
      durationMinutes: value.durationMinutes!,
      status: value.status as ContentStatus,
    });
  }
}
