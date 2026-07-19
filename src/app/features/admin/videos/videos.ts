import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LucidePencil, LucidePlus, LucideTrash2, LucideVideo } from '@lucide/angular';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StageLabelPipe } from '../../../shared/pipes/stage-label.pipe';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { VideosService } from '../../../services/videos.service';
import { Video } from '../../../models';
import { VideoFormDialog } from './video-form-dialog/video-form-dialog';

@Component({
  selector: 'app-videos',
  imports: [DataTable, EmptyState, StageLabelPipe, LucidePencil, LucidePlus, LucideTrash2, LucideVideo],
  templateUrl: './videos.html',
  styleUrl: './videos.scss',
})
export class Videos {
  private readonly videosService = inject(VideosService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly videos = this.videosService.videos;

  openAddDialog(): void {
    this.dialog
      .open(VideoFormDialog, { data: null, width: '600px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const video: Video = {
            id: `vid-${Date.now()}`,
            teacherName: 'محمد بكر',
            createdAt: new Date().toISOString().slice(0, 10),
            watchCount: 0,
            ...result,
          };
          this.videosService.add(video);
        }
      });
  }

  openEditDialog(video: Video): void {
    this.dialog
      .open(VideoFormDialog, { data: video, width: '600px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.videosService.update(video.id, result);
        }
      });
  }

  deleteVideo(video: Video): void {
    this.confirmDialog
      .confirm({
        title: 'حذف الفيديو',
        message: `هل تريد حذف الفيديو "${video.title}"؟`,
        confirmText: 'حذف',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.videosService.remove(video.id);
        }
      });
  }
}
