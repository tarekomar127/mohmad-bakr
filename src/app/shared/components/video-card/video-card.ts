import { Component, computed, input, output } from '@angular/core';
import { LucideClock, LucideCirclePlay, LucideLayers } from '@lucide/angular';
import { Video } from '../../../models';
import { ProgressBar } from '../progress-bar/progress-bar';
import { resolveMediaUrl } from '../../../core/utils/media-url.util';

@Component({
  selector: 'app-video-card',
  imports: [LucideClock, LucideCirclePlay, LucideLayers, ProgressBar],
  templateUrl: './video-card.html',
  styleUrl: './video-card.scss',
})
export class VideoCard {
  readonly video = input.required<Video>();
  readonly progressPercent = input<number | null>(null);
  readonly watch = output<void>();

  readonly thumbnail = computed(() => {
    const url = this.video().thumbnailUrl;
    return url ? resolveMediaUrl(url) : null;
  });
}
