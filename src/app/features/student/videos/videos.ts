import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VideoCard } from '../../../shared/components/video-card/video-card';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { VideosService } from '../../../services/videos.service';
import { Video } from '../../../models';
import { VideoPlayerDialog } from './video-player-dialog/video-player-dialog';

@Component({
  selector: 'app-student-videos',
  imports: [VideoCard, EmptyState],
  templateUrl: './videos.html',
  styleUrl: './videos.scss',
})
export class StudentVideos {
  private readonly videosService = inject(VideosService);
  private readonly dialog = inject(MatDialog);

  readonly videos = toSignal(this.videosService.getAll({ pageSize: 100 }).pipe(map((res) => res.items)), {
    initialValue: [] as Video[],
  });

  watch(video: Video): void {
    this.dialog.open(VideoPlayerDialog, { data: video, width: '640px' });
  }
}
