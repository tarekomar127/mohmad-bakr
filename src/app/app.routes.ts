import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      { path: '', loadComponent: () => import('./features/public/landing/landing').then((m) => m.Landing) },
      { path: 'about', loadComponent: () => import('./features/public/about/about').then((m) => m.About) },
    ],
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard) },
      { path: 'students', loadComponent: () => import('./features/admin/students/students').then((m) => m.Students) },
      { path: 'videos', loadComponent: () => import('./features/admin/videos/videos').then((m) => m.Videos) },
      { path: 'pdfs', loadComponent: () => import('./features/admin/pdfs/pdfs').then((m) => m.Pdfs) },
      { path: 'exams', loadComponent: () => import('./features/admin/exams/exams').then((m) => m.Exams) },
      {
        path: 'announcements',
        loadComponent: () => import('./features/admin/announcements/announcements').then((m) => m.Announcements),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/admin/notifications/notifications').then((m) => m.Notifications),
      },
      { path: 'analytics', loadComponent: () => import('./features/admin/analytics/analytics').then((m) => m.Analytics) },
      { path: 'settings', loadComponent: () => import('./features/admin/settings/settings').then((m) => m.Settings) },
    ],
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' },
    loadComponent: () => import('./layouts/student-layout/student-layout').then((m) => m.StudentLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/student/dashboard/dashboard').then((m) => m.StudentDashboard),
      },
      { path: 'videos', loadComponent: () => import('./features/student/videos/videos').then((m) => m.StudentVideos) },
      { path: 'pdfs', loadComponent: () => import('./features/student/pdfs/pdfs').then((m) => m.StudentPdfs) },
      { path: 'exams', loadComponent: () => import('./features/student/exams/exams').then((m) => m.StudentExams) },
      { path: 'results', loadComponent: () => import('./features/student/results/results').then((m) => m.StudentResults) },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/student/notifications/notifications').then((m) => m.StudentNotifications),
      },
      { path: 'profile', loadComponent: () => import('./features/student/profile/profile').then((m) => m.StudentProfile) },
    ],
  },
  { path: '404', loadComponent: () => import('./features/public/not-found/not-found').then((m) => m.NotFound) },
  { path: '**', redirectTo: '404' },
];
