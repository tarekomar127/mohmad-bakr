import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal';
import { ALL_STAGES, STAGE_LABELS, Student, StudentStatus } from '../../../../models';
import { EGYPT_GOVERNORATES } from '../../../../mock-data';
import { egyptianPhoneValidator } from '../../../../shared/utils/validators';

@Component({
  selector: 'app-student-edit-dialog',
  imports: [Modal, ReactiveFormsModule],
  templateUrl: './student-edit-dialog.html',
  styleUrl: './student-edit-dialog.scss',
})
export class StudentEditDialog {
  private readonly dialogRef = inject(MatDialogRef<StudentEditDialog, Partial<Student> | undefined>);
  readonly student = inject<Student>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  readonly stages = ALL_STAGES;
  readonly stageLabels = STAGE_LABELS;
  readonly governorates = EGYPT_GOVERNORATES;

  readonly form = this.fb.group({
    studentName: [this.student.studentName, Validators.required],
    parentName: [this.student.parentName, Validators.required],
    studentPhone: [this.student.studentPhone, [Validators.required, egyptianPhoneValidator()]],
    parentPhone: [this.student.parentPhone, [Validators.required, egyptianPhoneValidator()]],
    stage: [this.student.stage, Validators.required],
    governorate: [this.student.governorate, Validators.required],
    city: [this.student.city, Validators.required],
    status: [this.student.status as StudentStatus, Validators.required],
  });

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }
}
