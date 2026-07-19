import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LucideEye, LucidePencil, LucideSearch, LucideTrash2 } from '@lucide/angular';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ProgressBar } from '../../../shared/components/progress-bar/progress-bar';
import { StageLabelPipe } from '../../../shared/pipes/stage-label.pipe';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { StudentsService } from '../../../services/students.service';
import { ALL_STAGES, STAGE_LABELS, StudentGender, StudentStatus } from '../../../models';
import { StudentProfileDialog } from './student-profile-dialog/student-profile-dialog';
import { StudentEditDialog } from './student-edit-dialog/student-edit-dialog';

@Component({
  selector: 'app-students',
  imports: [
    FormsModule,
    DataTable,
    EmptyState,
    ProgressBar,
    StageLabelPipe,
    LucideEye,
    LucidePencil,
    LucideSearch,
    LucideTrash2,
  ],
  templateUrl: './students.html',
  styleUrl: './students.scss',
})
export class Students {
  private readonly studentsService = inject(StudentsService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly stages = ALL_STAGES;
  readonly stageLabels = STAGE_LABELS;

  readonly searchQuery = signal('');
  readonly stageFilter = signal<'' | (typeof ALL_STAGES)[number]>('');
  readonly genderFilter = signal<'' | StudentGender>('');
  readonly statusFilter = signal<'' | StudentStatus>('');

  readonly filteredStudents = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const stage = this.stageFilter();
    const gender = this.genderFilter();
    const status = this.statusFilter();

    return this.studentsService.students().filter((s) => {
      const matchesQuery =
        !query ||
        s.studentName.toLowerCase().includes(query) ||
        s.parentName.toLowerCase().includes(query) ||
        s.studentPhone.includes(query);
      const matchesStage = !stage || s.stage === stage;
      const matchesGender = !gender || s.gender === gender;
      const matchesStatus = !status || s.status === status;
      return matchesQuery && matchesStage && matchesGender && matchesStatus;
    });
  });

  statusLabel(status: StudentStatus): string {
    return status === 'active' ? 'نشط' : status === 'inactive' ? 'غير نشط' : 'موقوف';
  }

  statusClasses(status: StudentStatus): string {
    if (status === 'active') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
    if (status === 'inactive') return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
    return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
  }

  viewProfile(id: string): void {
    const student = this.studentsService.getById(id);
    if (student) {
      this.dialog.open(StudentProfileDialog, { data: student, width: '640px' });
    }
  }

  editStudent(id: string): void {
    const student = this.studentsService.getById(id);
    if (!student) return;
    this.dialog
      .open(StudentEditDialog, { data: student, width: '640px' })
      .afterClosed()
      .subscribe((patch) => {
        if (patch) {
          this.studentsService.update(id, patch);
        }
      });
  }

  deleteStudent(id: string, name: string): void {
    this.confirmDialog
      .confirm({
        title: 'حذف الطالب',
        message: `هل أنت متأكد من حذف الطالب "${name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
        confirmText: 'حذف',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.studentsService.remove(id);
        }
      });
  }
}
