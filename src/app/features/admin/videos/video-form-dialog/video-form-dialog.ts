import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideUpload } from '@lucide/angular';
import { Modal } from '../../../../shared/components/modal/modal';
import { StageNode, TermNode, UnitNode, Video, VideoCreateDto } from '../../../../models';
import { StructureService } from '../../../../services/structure.service';
import { VideosService } from '../../../../services/videos.service';
import { embedExplainLink, extractExplainLink, isYoutubeUrl, stripExplainLink } from '../../../../shared/utils/youtube.util';

@Component({
  selector: 'app-video-form-dialog',
  imports: [Modal, ReactiveFormsModule, FormsModule, LucideUpload],
  templateUrl: './video-form-dialog.html',
  styleUrl: './video-form-dialog.scss',
})
export class VideoFormDialog {
  private readonly dialogRef = inject(MatDialogRef<VideoFormDialog, VideoCreateDto | undefined>);
  readonly existing = inject<Video | null>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly structureService = inject(StructureService);
  private readonly videosService = inject(VideosService);

  readonly stages = this.structureService.stages;
  readonly uploading = signal(false);
  readonly uploadedVideoUrl = signal(this.existing?.videoUrl ?? '');
  readonly fileName = signal('');
  readonly explainYoutubeUrl = signal(extractExplainLink(this.existing?.description) ?? '');
  readonly explainYoutubeUrlInvalid = computed(
    () => !!this.explainYoutubeUrl() && !isYoutubeUrl(this.explainYoutubeUrl()),
  );

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
    description: [stripExplainLink(this.existing?.description ?? ''), Validators.required],
    thumbnailUrl: [this.existing?.thumbnailUrl ?? ''],
    lessonId: [this.existing?.lessonId ?? '', Validators.required],
    duration: [this.existing?.duration ?? 20, [Validators.required, Validators.min(1)]],
    isPublished: [this.existing?.isPublished ?? true],
  });

  constructor() {
    this.structureService.load().subscribe();
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

  onExplainYoutubeUrlChange(value: string): void {
    this.explainYoutubeUrl.set(value.trim());
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.fileName.set(file.name);
    this.uploading.set(true);
    this.videosService.uploadFile(file).subscribe({
      next: (url) => {
        this.uploadedVideoUrl.set(url);
        this.uploading.set(false);
      },
      error: () => this.uploading.set(false),
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid || !this.uploadedVideoUrl() || this.explainYoutubeUrlInvalid()) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({
      title: value.title!,
      description: embedExplainLink(value.description!, this.explainYoutubeUrl()),
      thumbnailUrl: value.thumbnailUrl ?? '',
      videoUrl: this.uploadedVideoUrl(),
      lessonId: value.lessonId!,
      duration: value.duration!,
      isPublished: value.isPublished!,
    });
  }
}
