import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideFileText, LucideUpload } from '@lucide/angular';
import { Modal } from '../../../../shared/components/modal/modal';
import { PdfCreateDto, PdfFile, StageNode, TermNode, UnitNode } from '../../../../models';
import { StructureService } from '../../../../services/structure.service';
import { PdfsService } from '../../../../services/pdfs.service';

@Component({
  selector: 'app-pdf-form-dialog',
  imports: [Modal, ReactiveFormsModule, FormsModule, LucideFileText, LucideUpload],
  templateUrl: './pdf-form-dialog.html',
  styleUrl: './pdf-form-dialog.scss',
})
export class PdfFormDialog {
  private readonly dialogRef = inject(MatDialogRef<PdfFormDialog, PdfCreateDto | undefined>);
  readonly existing = inject<PdfFile | null>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly structureService = inject(StructureService);
  private readonly pdfsService = inject(PdfsService);

  readonly stages = this.structureService.stages;
  readonly uploading = signal(false);
  readonly uploadedFileUrl = signal(this.existing?.fileUrl ?? '');
  readonly fileName = signal('');

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
    description: [this.existing?.description ?? '', Validators.required],
    lessonId: [this.existing?.lessonId ?? '', Validators.required],
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.fileName.set(file.name);
    this.uploading.set(true);
    this.pdfsService.uploadFile(file).subscribe({
      next: (url) => {
        this.uploadedFileUrl.set(url);
        this.uploading.set(false);
      },
      error: () => this.uploading.set(false),
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid || !this.uploadedFileUrl()) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({
      title: value.title!,
      description: value.description!,
      fileUrl: this.uploadedFileUrl(),
      lessonId: value.lessonId!,
    });
  }
}
