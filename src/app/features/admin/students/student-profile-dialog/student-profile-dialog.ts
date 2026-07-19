import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Modal } from '../../../../shared/components/modal/modal';
import { ProgressBar } from '../../../../shared/components/progress-bar/progress-bar';
import { StageLabelPipe } from '../../../../shared/pipes/stage-label.pipe';
import { Student } from '../../../../models';

@Component({
  selector: 'app-student-profile-dialog',
  imports: [Modal, ProgressBar, StageLabelPipe],
  templateUrl: './student-profile-dialog.html',
  styleUrl: './student-profile-dialog.scss',
})
export class StudentProfileDialog {
  private readonly dialogRef = inject(MatDialogRef<StudentProfileDialog>);
  readonly student = inject<Student>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
