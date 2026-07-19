import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LucideClipboardList, LucidePencil, LucidePlus, LucideTrash2 } from '@lucide/angular';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { ExamsService } from '../../../services/exams.service';
import { Exam } from '../../../models';
import { ExamFormDialog } from './exam-form-dialog/exam-form-dialog';

@Component({
  selector: 'app-exams',
  imports: [DataTable, EmptyState, LucideClipboardList, LucidePencil, LucidePlus, LucideTrash2],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams {
  private readonly examsService = inject(ExamsService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly exams = signal<Exam[]>([]);
  readonly loading = signal(false);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.examsService.getAll().subscribe({
      next: (res) => {
        this.exams.set(res.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openAddDialog(): void {
    this.dialog
      .open(ExamFormDialog, { data: null, width: '720px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.examsService.create(result).subscribe(() => this.reload());
        }
      });
  }

  openEditDialog(exam: Exam): void {
    this.dialog
      .open(ExamFormDialog, { data: exam, width: '720px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.examsService.update(exam.id, result).subscribe(() => this.reload());
        }
      });
  }

  deleteExam(exam: Exam): void {
    this.confirmDialog
      .confirm({ title: 'حذف الامتحان', message: `هل تريد حذف امتحان "${exam.title}"؟`, confirmText: 'حذف', danger: true })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.examsService.remove(exam.id).subscribe(() => this.reload());
        }
      });
  }
}
