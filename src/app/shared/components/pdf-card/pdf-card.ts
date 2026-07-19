import { Component, input, output } from '@angular/core';
import { LucideDownload, LucideEye, LucideFileText } from '@lucide/angular';
import { PdfFile } from '../../../models';

@Component({
  selector: 'app-pdf-card',
  imports: [LucideDownload, LucideEye, LucideFileText],
  templateUrl: './pdf-card.html',
  styleUrl: './pdf-card.scss',
})
export class PdfCard {
  readonly pdf = input.required<PdfFile>();
  readonly view = output<void>();
  readonly download = output<void>();
}
