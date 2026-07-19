import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideBriefcase, LucideGraduationCap } from '@lucide/angular';
import { TeacherService } from '../../../services/teacher.service';
import { GALLERY_IMAGES } from '../../../core/constants/gallery';
import { MediaUrlPipe } from '../../../shared/pipes/media-url.pipe';

@Component({
  selector: 'app-about',
  imports: [LucideBriefcase, LucideGraduationCap, MediaUrlPipe],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private readonly teacherService = inject(TeacherService);

  readonly teacher = toSignal(this.teacherService.load(), { initialValue: null });
  readonly galleryImages = GALLERY_IMAGES;
}
