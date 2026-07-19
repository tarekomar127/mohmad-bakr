import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideCirclePlay } from '@lucide/angular';
import { Modal } from '../../../../shared/components/modal/modal';
import { Video } from '../../../../models';

@Component({
  selector: 'app-video-player-dialog',
  imports: [Modal, LucideCirclePlay],
  templateUrl: './video-player-dialog.html',
  styleUrl: './video-player-dialog.scss',
})
export class VideoPlayerDialog {
  private readonly dialogRef = inject(MatDialogRef<VideoPlayerDialog, boolean>);
  readonly video = inject<Video>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close(false);
  }

  markComplete(): void {
    this.dialogRef.close(true);
  }
}
