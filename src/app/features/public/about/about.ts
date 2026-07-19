import { Component } from '@angular/core';
import { LucideAward, LucideBadgeCheck, LucideGraduationCap, LucideTrophy } from '@lucide/angular';
import { GalleryPlaceholder } from '../../../shared/components/gallery-placeholder/gallery-placeholder';
import { MOCK_TEACHER } from '../../../mock-data';

@Component({
  selector: 'app-about',
  imports: [GalleryPlaceholder, LucideAward, LucideBadgeCheck, LucideGraduationCap, LucideTrophy],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly teacher = MOCK_TEACHER;
}
