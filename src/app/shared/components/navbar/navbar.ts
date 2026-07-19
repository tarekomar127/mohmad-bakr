import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideMenu, LucideMoon, LucideSun, LucideX } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, LucideMenu, LucideMoon, LucideSun, LucideX],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);

  readonly isMobileOpen = signal(false);

  readonly navLinks = [
    { label: 'الرئيسية', path: '/', fragment: undefined },
    { label: 'عن المعلم', path: '/about', fragment: undefined },
    { label: 'المميزات', path: '/', fragment: 'features' },
    { label: 'الأسئلة الشائعة', path: '/', fragment: 'faq' },
    { label: 'تواصل معنا', path: '/', fragment: 'contact' },
  ];

  get dashboardPath(): string {
    return this.auth.currentUser()?.role === 'Admin' ? '/admin/dashboard' : '/student/dashboard';
  }

  closeMobile(): void {
    this.isMobileOpen.set(false);
  }
}
