import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideTrendingUp } from '@lucide/angular';
import { Modal } from '../../../../shared/components/modal/modal';
import { StageLabelPipe } from '../../../../shared/pipes/stage-label.pipe';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { ExamResultsService } from '../../../../services/exam-results.service';
import { ExamResult, GENDER_LABELS, Student } from '../../../../models';

@Component({
  selector: 'app-student-profile-dialog',
  imports: [Modal, StageLabelPipe, DatePipe, EmptyState, LucideTrendingUp],
  templateUrl: './student-profile-dialog.html',
  styleUrl: './student-profile-dialog.scss',
})
export class StudentProfileDialog {
  private readonly dialogRef = inject(MatDialogRef<StudentProfileDialog>);
  private readonly examResultsService = inject(ExamResultsService);
  readonly student = inject<Student>(MAT_DIALOG_DATA);
  readonly genderLabels = GENDER_LABELS;

  readonly loadingResults = signal(true);
  readonly results = signal<ExamResult[]>([]);

  readonly averagePercentage = computed(() => {
    const list = this.results();
    if (!list.length) return 0;
    return Math.round(list.reduce((sum, r) => sum + r.percentage, 0) / list.length);
  });

  constructor() {
    this.examResultsService.getAll({ pageSize: 500 }).subscribe({
      next: (res) => {
        this.results.set(res.items.filter((r) => r.studentId === this.student.id));
        this.loadingResults.set(false);
      },
      error: () => this.loadingResults.set(false),
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
