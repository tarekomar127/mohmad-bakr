import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { ALL_STAGES, DashboardStats, ScoreBucket, StageDistributionItem, StudentRankEntry } from '../models';
import { StudentsService } from './students.service';
import { VideosService } from './videos.service';
import { PdfsService } from './pdfs.service';
import { ExamsService } from './exams.service';
import { AnnouncementsService } from './announcements.service';
import { NotificationsService } from './notifications.service';
import { ExamResultsService } from './exam-results.service';

const SCORE_BUCKETS: { label: string; min: number; max: number }[] = [
  { label: 'ممتاز (90-100)', min: 90, max: 100 },
  { label: 'جيد جدًا (80-89)', min: 80, max: 89 },
  { label: 'جيد (65-79)', min: 65, max: 79 },
  { label: 'مقبول (50-64)', min: 50, max: 64 },
  { label: 'ضعيف (أقل من 50)', min: 0, max: 49 },
];

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly studentsService = inject(StudentsService);
  private readonly videosService = inject(VideosService);
  private readonly pdfsService = inject(PdfsService);
  private readonly examsService = inject(ExamsService);
  private readonly announcementsService = inject(AnnouncementsService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly examResultsService = inject(ExamResultsService);

  getStats(): Observable<DashboardStats> {
    return forkJoin({
      students: this.studentsService.getAll({ pageSize: 1 }),
      videos: this.videosService.getAll({ pageSize: 1 }),
      pdfs: this.pdfsService.getAll({ pageSize: 1 }),
      exams: this.examsService.getAll({ pageSize: 1 }),
      announcements: this.announcementsService.getAll({ pageSize: 1 }),
      notifications: this.notificationsService.getAll({ pageSize: 1 }),
    }).pipe(
      map(({ students, videos, pdfs, exams, announcements, notifications }) => ({
        totalStudents: students.totalCount,
        totalVideos: videos.totalCount,
        totalPdfs: pdfs.totalCount,
        totalExams: exams.totalCount,
        totalAnnouncements: announcements.totalCount,
        totalNotifications: notifications.totalCount,
      })),
    );
  }

  getStageDistribution(): Observable<StageDistributionItem[]> {
    const requests = ALL_STAGES.map((stage) =>
      this.studentsService.getAll({ stage, pageSize: 1 }).pipe(
        map((result) => ({ stage, studentCount: result.totalCount })),
      ),
    );
    return forkJoin(requests);
  }

  getStudentPerformance(): Observable<{
    topStudents: StudentRankEntry[];
    weakStudents: StudentRankEntry[];
    scoreDistribution: ScoreBucket[];
  }> {
    return this.examResultsService.getAll({ pageSize: 1000 }).pipe(
      map((result) => {
        const byStudent = new Map<string, { name: string; total: number; count: number }>();
        for (const r of result.items) {
          const entry = byStudent.get(r.studentId) ?? { name: r.studentName, total: 0, count: 0 };
          entry.total += r.percentage;
          entry.count += 1;
          byStudent.set(r.studentId, entry);
        }
        const ranked: StudentRankEntry[] = [...byStudent.entries()]
          .map(([studentId, entry]) => ({
            studentId,
            studentName: entry.name,
            averagePercentage: Math.round(entry.total / entry.count),
            resultsCount: entry.count,
          }))
          .sort((a, b) => b.averagePercentage - a.averagePercentage);

        const scoreDistribution: ScoreBucket[] = SCORE_BUCKETS.map((bucket) => ({
          label: bucket.label,
          count: result.items.filter((r) => r.percentage >= bucket.min && r.percentage <= bucket.max).length,
        }));

        return {
          topStudents: ranked.slice(0, 5),
          weakStudents: ranked.slice(-5).reverse(),
          scoreDistribution,
        };
      }),
    );
  }
}
