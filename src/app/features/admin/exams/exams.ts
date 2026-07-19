import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LucideClipboardList, LucidePencil, LucidePlus, LucideTrash2 } from '@lucide/angular';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StageLabelPipe } from '../../../shared/pipes/stage-label.pipe';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { ExamsService } from '../../../services/exams.service';
import { Exam } from '../../../models';
import { ExamFormDialog } from './exam-form-dialog/exam-form-dialog';

@Component({
  selector: 'app-exams',
  imports: [DataTable, EmptyState, StageLabelPipe, LucideClipboardList, LucidePencil, LucidePlus, LucideTrash2],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams {
  private readonly examsService = inject(ExamsService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly exams = this.examsService.exams;

  openAddDialog(): void {
    this.dialog
      .open(ExamFormDialog, { data: null, width: '560px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const exam: Exam = {
            id: `exam-${Date.now()}`,
            createdAt: new Date().toISOString().slice(0, 10),
            ...result,
          };
          this.examsService.add(exam);
        }
      });
  }

  openEditDialog(exam: Exam): void {
    this.dialog
      .open(ExamFormDialog, { data: exam, width: '560px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.examsService.update(exam.id, result);
        }
      });
  }

  deleteExam(exam: Exam): void {
    this.confirmDialog
      .confirm({ title: 'حذف الامتحان', message: `هل تريد حذف امتحان "${exam.title}"؟`, confirmText: 'حذف', danger: true })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.examsService.remove(exam.id);
        }
      });
  }
}
