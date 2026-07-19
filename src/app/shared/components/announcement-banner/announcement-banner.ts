import { Component, input } from '@angular/core';
import { LucideMegaphone } from '@lucide/angular';
import { Announcement } from '../../../models';
import { StageLabelPipe } from '../../pipes/stage-label.pipe';

@Component({
  selector: 'app-announcement-banner',
  imports: [LucideMegaphone, StageLabelPipe],
  templateUrl: './announcement-banner.html',
  styleUrl: './announcement-banner.scss',
})
export class AnnouncementBanner {
  readonly announcement = input.required<Announcement>();
}
