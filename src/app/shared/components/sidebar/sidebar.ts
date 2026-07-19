import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly brandTitle = input('الشافعي');
  readonly brandSubtitle = input('');

  readonly isMobileOpen = signal(false);

  readonly brandInitial = computed(() => this.brandTitle().trim().charAt(0) || 'ا');
  readonly asidePosition = computed(() => (this.isMobileOpen() ? 'start-0' : '-start-72'));

  toggleMobile(): void {
    this.isMobileOpen.update((v) => !v);
  }

  close(): void {
    this.isMobileOpen.set(false);
  }
}
