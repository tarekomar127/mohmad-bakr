import { Component, input } from '@angular/core';
import { LucideImage } from '@lucide/angular';

@Component({
  selector: 'app-gallery-placeholder',
  imports: [LucideImage],
  templateUrl: './gallery-placeholder.html',
  styleUrl: './gallery-placeholder.scss',
})
export class GalleryPlaceholder {
  readonly caption = input('صورة قادمة قريباً');
}
