import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Modal } from '../../../../shared/components/modal/modal';
import { BrandIcon } from '../../../../shared/components/brand-icon/brand-icon';
import { Video } from '../../../../models';
import { extractExplainLink, stripExplainLink, youtubeEmbedUrl } from '../../../../shared/utils/youtube.util';

@Component({
  selector: 'app-video-player-dialog',
  imports: [Modal, BrandIcon],
  templateUrl: './video-player-dialog.html',
  styleUrl: './video-player-dialog.scss',
})
export class VideoPlayerDialog {
  private readonly dialogRef = inject(MatDialogRef<VideoPlayerDialog>);
  private readonly sanitizer = inject(DomSanitizer);
  readonly video = inject<Video>(MAT_DIALOG_DATA);
  readonly embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    this.video.youTubeEmbedUrl ?? youtubeEmbedUrl(this.video.youTubeUrl) ?? '',
  );
  readonly description = stripExplainLink(this.video.description);
  readonly explainYoutubeUrl = extractExplainLink(this.video.description);

  close(): void {
    this.dialogRef.close();
  }
}
