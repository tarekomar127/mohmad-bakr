import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LucidePhone } from '@lucide/angular';
import { BrandIcon } from '../brand-icon/brand-icon';
import { TeacherService } from '../../../services/teacher.service';
import { SITE_CONTACT } from '../../../core/constants/site-contact';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, LucidePhone, BrandIcon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly teacherService = inject(TeacherService);

  readonly teacher = toSignal(this.teacherService.load(), { initialValue: null });
  readonly contact = SITE_CONTACT;
  readonly year = new Date().getFullYear();
}
