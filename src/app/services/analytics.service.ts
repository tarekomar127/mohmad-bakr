import { Injectable, computed, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { ALL_STAGES, DashboardStats, StageDistributionItem, StudentRankEntry } from '../models';
import {
  MOCK_AVERAGE_SCORES,
  MOCK_EXAM_RESULT_DISTRIBUTION,
  MOCK_PDF_DOWNLOADS,
  MOCK_STUDENT_ACTIVITY,
  MOCK_VIDEO_COMPLETION,
  MOCK_WATCH_TIME,
} from '../mock-data';
import { StudentsService } from './students.service';
import { VideosService } from './videos.service';
import { PdfsService } from './pdfs.service';
import { ExamsService } from './exams.service';
import { AnnouncementsService } from './announcements.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly studentsService = inject(StudentsService);
  private readonly videosService = inject(VideosService);
  private readonly pdfsService = inject(PdfsService);
  private readonly examsService = inject(ExamsService);
  private readonly announcementsService = inject(AnnouncementsService);

  readonly studentActivity = MOCK_STUDENT_ACTIVITY;
  readonly averageScoresTrend = MOCK_AVERAGE_SCORES;
  readonly videoCompletion = MOCK_VIDEO_COMPLETION;
  readonly watchTime = MOCK_WATCH_TIME;
  readonly pdfDownloads = MOCK_PDF_DOWNLOADS;
  readonly examResultDistribution = MOCK_EXAM_RESULT_DISTRIBUTION;

  readonly dashboardStats = computed<DashboardStats>(() => {
    const students = this.studentsService.students();
    const activeCount = students.filter((s) => s.status === 'active').length;
    return {
      totalStudents: students.length,
      totalVideos: this.videosService.videos().length,
      totalPdfs: this.pdfsService.pdfs().length,
      totalExams: this.examsService.exams().length,
      totalAnnouncements: this.announcementsService.announcements().length,
      activityRate: students.length ? Math.round((activeCount / students.length) * 100) : 0,
    };
  });

  readonly stageDistribution = computed<StageDistributionItem[]>(() => {
    const students = this.studentsService.students();
    const videos = this.videosService.videos();
    const pdfs = this.pdfsService.pdfs();
    const exams = this.examsService.exams();
    return ALL_STAGES.map((stage) => ({
      stage,
      studentCount: students.filter((s) => s.stage === stage).length,
      videoCount: videos.filter((v) => v.stage === stage).length,
      pdfCount: pdfs.filter((p) => p.stage === stage).length,
      examCount: exams.filter((e) => e.stage === stage).length,
    }));
  });

  readonly topStudents = computed<StudentRankEntry[]>(() => this.rankedStudents().slice(0, 5));

  readonly weakStudents = computed<StudentRankEntry[]>(() =>
    this.rankedStudents().slice(-5).reverse(),
  );

  getDashboardStats(): Observable<DashboardStats> {
    return of(this.dashboardStats()).pipe(delay(300));
  }

  private rankedStudents(): StudentRankEntry[] {
    return [...this.studentsService.students()]
      .sort((a, b) => b.averageScore - a.averageScore)
      .map((s) => ({
        studentId: s.id,
        studentName: s.studentName,
        averageScore: s.averageScore,
        progressPercent: s.progressPercent,
      }));
  }
}
