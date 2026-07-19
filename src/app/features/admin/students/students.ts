import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LucideEye, LucidePencil, LucideSearch, LucideTrash2 } from '@lucide/angular';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StageLabelPipe } from '../../../shared/pipes/stage-label.pipe';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { StudentsService } from '../../../services/students.service';
import { ALL_STAGES, GENDER_LABELS, Gender, STAGE_LABELS, Student } from '../../../models';
import { StudentProfileDialog } from './student-profile-dialog/student-profile-dialog';
import { StudentEditDialog } from './student-edit-dialog/student-edit-dialog';

@Component({
  selector: 'app-students',
  imports: [FormsModule, DataTable, EmptyState, StageLabelPipe, LucideEye, LucidePencil, LucideSearch, LucideTrash2],
  templateUrl: './students.html',
  styleUrl: './students.scss',
})
export class Students {
  private readonly studentsService = inject(StudentsService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly stages = ALL_STAGES;
  readonly stageLabels = STAGE_LABELS;
  readonly genderLabels = GENDER_LABELS;

  readonly searchQuery = signal('');
  readonly stageFilter = signal<'' | (typeof ALL_STAGES)[number]>('');
  readonly genderFilter = signal<'' | Gender>('');

  readonly students = signal<Student[]>([]);
  readonly loading = signal(false);

  constructor() {
    effect(() => {
      this.searchQuery();
      this.stageFilter();
      this.genderFilter();
      this.reload();
    });
  }

  reload(): void {
    this.loading.set(true);
    this.studentsService
      .getAll({
        search: this.searchQuery() || undefined,
        stage: this.stageFilter() || undefined,
        gender: this.genderFilter() || undefined,
      })
      .subscribe({
        next: (res) => {
          this.students.set(res.items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  viewProfile(student: Student): void {
    this.dialog.open(StudentProfileDialog, { data: student, width: '640px' });
  }

  editStudent(student: Student): void {
    this.dialog
      .open(StudentEditDialog, { data: student, width: '640px' })
      .afterClosed()
      .subscribe((patch) => {
        if (patch) {
          this.studentsService.update(student.id, patch).subscribe(() => this.reload());
        }
      });
  }

  deleteStudent(student: Student): void {
    this.confirmDialog
      .confirm({
        title: 'حذف الطالب',
        message: `هل أنت متأكد من حذف الطالب "${student.fullName}"؟ لا يمكن التراجع عن هذا الإجراء.`,
        confirmText: 'حذف',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.studentsService.remove(student.id).subscribe(() => this.reload());
        }
      });
  }
}
