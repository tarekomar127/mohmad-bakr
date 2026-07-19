import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucidePhone } from '@lucide/angular';
import { BrandIcon } from '../brand-icon/brand-icon';
import { MOCK_TEACHER } from '../../../mock-data';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, LucidePhone, BrandIcon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly teacher = MOCK_TEACHER;
  readonly year = new Date().getFullYear();
}
