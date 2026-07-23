import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal';
import { StageNode, TermNode, UnitNode, Video, VideoCreateDto } from '../../../../models';
import { StructureService } from '../../../../services/structure.service';
import { embedExplainLink, extractExplainLink, isYoutubeUrl, stripExplainLink } from '../../../../shared/utils/youtube.util';

@Component({
  selector: 'app-video-form-dialog',
  imports: [Modal, ReactiveFormsModule, FormsModule],
  templateUrl: './video-form-dialog.html',
  styleUrl: './video-form-dialog.scss',
})
export class VideoFormDialog {
  private readonly dialogRef = inject(MatDialogRef<VideoFormDialog, VideoCreateDto | undefined>);
  readonly existing = inject<Video | null>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly structureService = inject(StructureService);

  readonly stages = this.structureService.stages;
  readonly explainYoutubeUrl = signal(extractExplainLink(this.existing?.description) ?? '');
  readonly explainYoutubeUrlInvalid = computed(
    () => !!this.explainYoutubeUrl() && !isYoutubeUrl(this.explainYoutubeUrl()),
  );

  readonly selectedStageId = signal(this.existing?.educationalStageId ?? '');
  readonly selectedTermId = signal(this.existing?.termId ?? '');

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
    youTubeUrl: [this.existing?.youTubeUrl ?? '', [Validators.required, this.youtubeUrlValidator]],
    unitId: [this.existing?.unitId ?? '', Validators.required],
    duration: [this.existing?.duration ?? 20, [Validators.required, Validators.min(1)]],
    isPublished: [this.existing?.isPublished ?? true],
  });

  private youtubeUrlValidator(control: { value: string }) {
    return !control.value || isYoutubeUrl(control.value) ? null : { invalidYoutubeUrl: true };
  }

  constructor() {
    this.structureService.load().subscribe();
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

  onExplainYoutubeUrlChange(value: string): void {
    this.explainYoutubeUrl.set(value.trim());
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid || this.explainYoutubeUrlInvalid() || !this.selectedStageId() || !this.selectedTermId()) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({
      title: value.title!,
      description: embedExplainLink(value.description!, this.explainYoutubeUrl()),
      thumbnailUrl: value.thumbnailUrl ?? '',
      videoUrl: null,
      youTubeUrl: value.youTubeUrl!,
      educationalStageId: this.selectedStageId(),
      termId: this.selectedTermId(),
      unitId: value.unitId!,
      duration: value.duration!,
      isPublished: value.isPublished!,
    });
  }
}
