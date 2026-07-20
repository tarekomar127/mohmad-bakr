import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Modal } from '../../../../shared/components/modal/modal';
import { BrandIcon } from '../../../../shared/components/brand-icon/brand-icon';
import { Video } from '../../../../models';
import { resolveMediaUrl } from '../../../../core/utils/media-url.util';
import { extractExplainLink, stripExplainLink } from '../../../../shared/utils/youtube.util';

@Component({
  selector: 'app-video-player-dialog',
  imports: [Modal, BrandIcon],
  templateUrl: './video-player-dialog.html',
  styleUrl: './video-player-dialog.scss',
})
export class VideoPlayerDialog {
  private readonly dialogRef = inject(MatDialogRef<VideoPlayerDialog>);
  readonly video = inject<Video>(MAT_DIALOG_DATA);
  readonly videoSrc = resolveMediaUrl(this.video.videoUrl);
  readonly description = stripExplainLink(this.video.description);
  readonly explainYoutubeUrl = extractExplainLink(this.video.description);

  close(): void {
    this.dialogRef.close();
  }
}
