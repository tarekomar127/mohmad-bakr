import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VideoCard } from '../../../shared/components/video-card/video-card';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { VideosService } from '../../../services/videos.service';
import { Video } from '../../../models';
import { VideoPlayerDialog } from './video-player-dialog/video-player-dialog';

function stableProgress(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 100;
  }
  return hash;
}

@Component({
  selector: 'app-student-videos',
  imports: [VideoCard, EmptyState],
  templateUrl: './videos.html',
  styleUrl: './videos.scss',
})
export class StudentVideos {
  private readonly videosService = inject(VideosService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);

  readonly videos = toSignal(this.videosService.getForCurrentStudent(), { initialValue: [] as Video[] });
  private readonly completed = signal<Set<string>>(new Set());

  progressFor(video: Video): number {
    return this.completed().has(video.id) ? 100 : stableProgress(video.id);
  }

  watch(video: Video): void {
    this.dialog
      .open(VideoPlayerDialog, { data: video, width: '640px' })
      .afterClosed()
      .subscribe((finished) => {
        if (finished) {
          this.completed.update((set) => new Set(set).add(video.id));
        }
      });
  }

  readonly openFromQuery = computed(() => this.route.snapshot.queryParamMap.get('open'));
}
