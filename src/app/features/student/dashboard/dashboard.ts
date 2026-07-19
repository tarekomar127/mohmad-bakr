import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { LucideBookOpen, LucideClipboardList, LucideTrendingUp } from '@lucide/angular';
import { VideoCard } from '../../../shared/components/video-card/video-card';
import { PdfCard } from '../../../shared/components/pdf-card/pdf-card';
import { ExamCard } from '../../../shared/components/exam-card/exam-card';
import { AnnouncementBanner } from '../../../shared/components/announcement-banner/announcement-banner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { AuthService } from '../../../core/services/auth.service';
import { VideosService } from '../../../services/videos.service';
import { PdfsService } from '../../../services/pdfs.service';
import { ExamsService } from '../../../services/exams.service';
import { ExamResultsService } from '../../../services/exam-results.service';
import { AnnouncementsService } from '../../../services/announcements.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [
    VideoCard,
    PdfCard,
    ExamCard,
    AnnouncementBanner,
    EmptyState,
    LucideBookOpen,
    LucideClipboardList,
    LucideTrendingUp,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class StudentDashboard {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly videosService = inject(VideosService);
  private readonly pdfsService = inject(PdfsService);
  private readonly examsService = inject(ExamsService);
  private readonly examResultsService = inject(ExamResultsService);
  private readonly announcementsService = inject(AnnouncementsService);

  readonly currentUser = this.auth.currentUser;

  private readonly allVideos = toSignal(this.videosService.getAll({ pageSize: 100 }).pipe(map((res) => res.items)), {
    initialValue: [],
  });
  private readonly allPdfs = toSignal(this.pdfsService.getAll({ pageSize: 100 }).pipe(map((res) => res.items)), {
    initialValue: [],
  });
  private readonly allExams = toSignal(this.examsService.getAll({ pageSize: 100 }).pipe(map((res) => res.items)), {
    initialValue: [],
  });
  private readonly allResults = toSignal(
    this.examResultsService.getAll({ pageSize: 100 }).pipe(map((res) => res.items)),
    { initialValue: [] },
  );
  private readonly allAnnouncements = toSignal(
    this.announcementsService.getAll({ pageSize: 100 }).pipe(map((res) => res.items)),
    { initialValue: [] },
  );

  readonly recentVideos = computed(() => this.allVideos().slice(0, 3));
  readonly recentPdfs = computed(() => this.allPdfs().slice(0, 3));
  readonly upcomingExams = computed(() => this.allExams().slice(0, 3));
  readonly announcements = computed(() => this.allAnnouncements().slice(0, 3));

  readonly examsTaken = computed(() => this.allResults().length);
  readonly videosCount = computed(() => this.allVideos().length);
  readonly averagePercentage = computed(() => {
    const list = this.allResults();
    if (!list.length) return 0;
    return Math.round(list.reduce((sum, r) => sum + r.percentage, 0) / list.length);
  });

  watchVideo(): void {
    this.router.navigate(['/student/videos']);
  }

  viewPdf(): void {
    this.router.navigate(['/student/pdfs']);
  }

  startExam(id: string): void {
    this.router.navigate(['/student/exams', id]);
  }
}
