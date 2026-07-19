import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideBell,
  LucideBookOpen,
  LucideCircleUser,
  LucideClipboardCheck,
  LucideClipboardList,
  LucideFileText,
  LucideHouse,
  LucideLogOut,
  LucideMenu,
  LucideMoon,
  LucideSun,
  LucideVideo,
} from '@lucide/angular';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { StageLabelPipe } from '../../shared/pipes/stage-label.pipe';

@Component({
  selector: 'app-student-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Sidebar,
    StageLabelPipe,
    LucideBell,
    LucideBookOpen,
    LucideCircleUser,
    LucideClipboardCheck,
    LucideClipboardList,
    LucideFileText,
    LucideHouse,
    LucideLogOut,
    LucideMenu,
    LucideMoon,
    LucideSun,
    LucideVideo,
  ],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.scss',
})
export class StudentLayout {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
