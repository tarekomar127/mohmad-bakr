import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LucideFileText, LucidePencil, LucidePlus, LucideTrash2 } from '@lucide/angular';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { PdfsService } from '../../../services/pdfs.service';
import { PdfFile } from '../../../models';
import { PdfFormDialog } from './pdf-form-dialog/pdf-form-dialog';

@Component({
  selector: 'app-pdfs',
  imports: [DataTable, EmptyState, LucideFileText, LucidePencil, LucidePlus, LucideTrash2, DatePipe],
  templateUrl: './pdfs.html',
  styleUrl: './pdfs.scss',
})
export class Pdfs {
  private readonly pdfsService = inject(PdfsService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly pdfs = signal<PdfFile[]>([]);
  readonly loading = signal(false);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.pdfsService.getAll().subscribe({
      next: (res) => {
        this.pdfs.set(res.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openAddDialog(): void {
    this.dialog
      .open(PdfFormDialog, { data: null, width: '640px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.pdfsService.create(result).subscribe(() => this.reload());
        }
      });
  }

  openEditDialog(pdf: PdfFile): void {
    this.dialog
      .open(PdfFormDialog, { data: pdf, width: '640px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.pdfsService.update(pdf.id, result).subscribe(() => this.reload());
        }
      });
  }

  deletePdf(pdf: PdfFile): void {
    this.confirmDialog
      .confirm({ title: 'حذف الملف', message: `هل تريد حذف الملف "${pdf.title}"؟`, confirmText: 'حذف', danger: true })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.pdfsService.remove(pdf.id).subscribe(() => this.reload());
        }
      });
  }
}
