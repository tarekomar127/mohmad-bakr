import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Modal } from '../../../../shared/components/modal/modal';
import { Video } from '../../../../models';
import { resolveMediaUrl } from '../../../../core/utils/media-url.util';

@Component({
  selector: 'app-video-player-dialog',
  imports: [Modal],
  templateUrl: './video-player-dialog.html',
  styleUrl: './video-player-dialog.scss',
})
export class VideoPlayerDialog {
  private readonly dialogRef = inject(MatDialogRef<VideoPlayerDialog>);
  readonly video = inject<Video>(MAT_DIALOG_DATA);
  readonly videoSrc = resolveMediaUrl(this.video.videoUrl);

  close(): void {
    this.dialogRef.close();
  }
}
