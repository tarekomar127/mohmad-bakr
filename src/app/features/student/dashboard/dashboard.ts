import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LucideBookOpen, LucideClipboardList, LucideTrendingUp } from '@lucide/angular';
import { VideoCard } from '../../../shared/components/video-card/video-card';
import { PdfCard } from '../../../shared/components/pdf-card/pdf-card';
import { ExamCard } from '../../../shared/components/exam-card/exam-card';
import { AnnouncementBanner } from '../../../shared/components/announcement-banner/announcement-banner';
import { ProgressBar } from '../../../shared/components/progress-bar/progress-bar';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { AuthService } from '../../../core/services/auth.service';
import { StudentsService } from '../../../services/students.service';
import { VideosService } from '../../../services/videos.service';
import { PdfsService } from '../../../services/pdfs.service';
import { ExamsService } from '../../../services/exams.service';
import { AnnouncementsService } from '../../../services/announcements.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [VideoCard, PdfCard, ExamCard, AnnouncementBanner, ProgressBar, EmptyState, LucideBookOpen, LucideClipboardList, LucideTrendingUp],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class StudentDashboard {
  private readonly auth = inject(AuthService);
  private readonly studentsService = inject(StudentsService);
  private readonly router = inject(Router);

  readonly currentUser = this.auth.currentUser;
  readonly student = computed(() => this.studentsService.getById(this.currentUser()?.id ?? ''));

  private readonly videosService = inject(VideosService);
  private readonly pdfsService = inject(PdfsService);
  private readonly examsService = inject(ExamsService);
  private readonly announcementsService = inject(AnnouncementsService);

  private readonly allVideos = toSignal(this.videosService.getForCurrentStudent(), { initialValue: [] });
  private readonly allPdfs = toSignal(this.pdfsService.getForCurrentStudent(), { initialValue: [] });
  private readonly allExams = toSignal(this.examsService.getForCurrentStudent(), { initialValue: [] });
  private readonly allAnnouncements = toSignal(this.announcementsService.getForCurrentStudent(), { initialValue: [] });

  readonly recentVideos = computed(() => this.allVideos().slice(0, 3));
  readonly recentPdfs = computed(() => this.allPdfs().slice(0, 3));
  readonly upcomingExams = computed(() => this.allExams().slice(0, 3));
  readonly announcements = computed(() => this.allAnnouncements().slice(0, 3));

  watchVideo(id: string): void {
    this.router.navigate(['/student/videos'], { queryParams: { open: id } });
  }

  viewPdf(id: string): void {
    this.router.navigate(['/student/pdfs'], { queryParams: { open: id } });
  }

  startExam(id: string): void {
    this.router.navigate(['/student/exams'], { queryParams: { open: id } });
  }
}
