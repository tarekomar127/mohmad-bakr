import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { LucideClipboardCheck, LucideEye } from '@lucide/angular';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ExamResultsService } from '../../../services/exam-results.service';
import { ExamResult } from '../../../models';
import { GradeDialog } from './grade-dialog/grade-dialog';

@Component({
  selector: 'app-results',
  imports: [DataTable, EmptyState, LucideClipboardCheck, LucideEye, DatePipe],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  private readonly examResultsService = inject(ExamResultsService);
  private readonly dialog = inject(MatDialog);

  readonly results = signal<ExamResult[]>([]);
  readonly loading = signal(false);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.examResultsService.getAll({ pageSize: 200 }).subscribe({
      next: (res) => {
        this.results.set(res.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openGradeDialog(result: ExamResult): void {
    this.dialog
      .open(GradeDialog, { data: result, width: '640px' })
      .afterClosed()
      .subscribe((changed) => {
        if (changed) this.reload();
      });
  }
}
