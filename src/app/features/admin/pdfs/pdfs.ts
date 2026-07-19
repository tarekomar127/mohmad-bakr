import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LucideDownload, LucideFileText, LucidePencil, LucidePlus, LucideTrash2 } from '@lucide/angular';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StageLabelPipe } from '../../../shared/pipes/stage-label.pipe';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { PdfsService } from '../../../services/pdfs.service';
import { PdfFile } from '../../../models';
import { PdfFormDialog } from './pdf-form-dialog/pdf-form-dialog';

@Component({
  selector: 'app-pdfs',
  imports: [DataTable, EmptyState, StageLabelPipe, LucideDownload, LucideFileText, LucidePencil, LucidePlus, LucideTrash2],
  templateUrl: './pdfs.html',
  styleUrl: './pdfs.scss',
})
export class Pdfs {
  private readonly pdfsService = inject(PdfsService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly pdfs = this.pdfsService.pdfs;

  openAddDialog(): void {
    this.dialog
      .open(PdfFormDialog, { data: null, width: '560px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const pdf: PdfFile = {
            id: `pdf-${Date.now()}`,
            uploadDate: new Date().toISOString().slice(0, 10),
            downloadCount: 0,
            ...result,
          };
          this.pdfsService.add(pdf);
        }
      });
  }

  openEditDialog(pdf: PdfFile): void {
    this.dialog
      .open(PdfFormDialog, { data: pdf, width: '560px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.pdfsService.update(pdf.id, result);
        }
      });
  }

  deletePdf(pdf: PdfFile): void {
    this.confirmDialog
      .confirm({ title: 'حذف الملف', message: `هل تريد حذف الملف "${pdf.title}"؟`, confirmText: 'حذف', danger: true })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.pdfsService.remove(pdf.id);
        }
      });
  }
}
