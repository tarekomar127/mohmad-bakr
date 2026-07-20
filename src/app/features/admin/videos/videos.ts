import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LucidePencil, LucidePlus, LucideTrash2, LucideVideo } from '@lucide/angular';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { VideosService } from '../../../services/videos.service';
import { Video } from '../../../models';
import { VideoFormDialog } from './video-form-dialog/video-form-dialog';
import { resolveMediaUrl } from '../../../core/utils/media-url.util';

@Component({
  selector: 'app-videos',
  imports: [DataTable, EmptyState, LucidePencil, LucidePlus, LucideTrash2, LucideVideo],
  templateUrl: './videos.html',
  styleUrl: './videos.scss',
})
export class Videos {
  private readonly videosService = inject(VideosService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly videos = signal<Video[]>([]);
  readonly loading = signal(false);

  thumbFor(video: Video): string | null {
    return video.thumbnailUrl ? resolveMediaUrl(video.thumbnailUrl) : null;
  }

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.videosService.getAll().subscribe({
      next: (res) => {
        this.videos.set(res.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openAddDialog(): void {
    this.dialog
      .open(VideoFormDialog, { data: null, width: '640px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.videosService.create(result).subscribe(() => this.reload());
        }
      });
  }

  openEditDialog(video: Video): void {
    this.dialog
      .open(VideoFormDialog, { data: video, width: '640px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.videosService.update(video.id, result).subscribe(() => this.reload());
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
          this.videosService.remove(video.id).subscribe(() => this.reload());
        }
      });
  }
}
