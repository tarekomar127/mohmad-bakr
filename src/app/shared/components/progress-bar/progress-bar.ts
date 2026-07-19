import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  readonly value = input(0);
  readonly showPercentLabel = input(true);

  readonly clamped = computed(() => Math.min(100, Math.max(0, this.value())));

  readonly toneClass = computed(() => {
    const v = this.clamped();
    if (v >= 75) return 'bg-primary';
    if (v >= 45) return 'bg-primary/70';
    return 'bg-primary/40';
  });
}
