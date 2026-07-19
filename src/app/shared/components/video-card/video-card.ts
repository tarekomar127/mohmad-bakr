import { Component, input, output } from '@angular/core';
import { LucideClock, LucideCirclePlay, LucideUser } from '@lucide/angular';
import { Video } from '../../../models';
import { ProgressBar } from '../progress-bar/progress-bar';

@Component({
  selector: 'app-video-card',
  imports: [LucideClock, LucideCirclePlay, LucideUser, ProgressBar],
  templateUrl: './video-card.html',
  styleUrl: './video-card.scss',
})
export class VideoCard {
  readonly video = input.required<Video>();
  readonly progressPercent = input<number | null>(null);
  readonly watch = output<void>();
}
