import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Modal } from '../../../../shared/components/modal/modal';
import { StageLabelPipe } from '../../../../shared/pipes/stage-label.pipe';
import { GENDER_LABELS, Student } from '../../../../models';

@Component({
  selector: 'app-student-profile-dialog',
  imports: [Modal, StageLabelPipe, DatePipe],
  templateUrl: './student-profile-dialog.html',
  styleUrl: './student-profile-dialog.scss',
})
export class StudentProfileDialog {
  private readonly dialogRef = inject(MatDialogRef<StudentProfileDialog>);
  readonly student = inject<Student>(MAT_DIALOG_DATA);
  readonly genderLabels = GENDER_LABELS;

  close(): void {
    this.dialogRef.close();
  }
}
