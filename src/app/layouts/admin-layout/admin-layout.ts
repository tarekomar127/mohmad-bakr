import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideBell,
  LucideChartColumn,
  LucideClipboardList,
  LucideFileText,
  LucideLayers,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideMegaphone,
  LucideMenu,
  LucideMoon,
  LucideSettings,
  LucideSun,
  LucideUsers,
  LucideVideo,
} from '@lucide/angular';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Sidebar,
    LucideBell,
    LucideChartColumn,
    LucideClipboardList,
    LucideFileText,
    LucideLayers,
    LucideLayoutDashboard,
    LucideLogOut,
    LucideMegaphone,
    LucideMenu,
    LucideMoon,
    LucideSettings,
    LucideSun,
    LucideUsers,
    LucideVideo,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
