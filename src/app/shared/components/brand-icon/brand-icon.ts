import { Component, input } from '@angular/core';

export type BrandIconName = 'youtube' | 'facebook' | 'tiktok' | 'whatsapp';

@Component({
  selector: 'app-brand-icon',
  imports: [],
  templateUrl: './brand-icon.html',
  styleUrl: './brand-icon.scss',
})
export class BrandIcon {
  readonly name = input.required<BrandIconName>();
  readonly size = input(16);
}
