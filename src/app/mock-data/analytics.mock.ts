import { ALL_STAGES, DashboardStats, SeriesChartData, StageDistributionItem, StudentRankEntry } from '../models';
import { MOCK_STUDENTS } from './students.mock';
import { MOCK_VIDEOS } from './videos.mock';
import { MOCK_PDFS } from './pdfs.mock';
import { MOCK_EXAMS } from './exams.mock';
import { MOCK_ANNOUNCEMENTS } from './announcements.mock';

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalStudents: MOCK_STUDENTS.length,
  totalVideos: MOCK_VIDEOS.length,
  totalPdfs: MOCK_PDFS.length,
  totalExams: MOCK_EXAMS.length,
  totalAnnouncements: MOCK_ANNOUNCEMENTS.length,
  activityRate: Math.round(
    (MOCK_STUDENTS.filter((s) => s.status === 'active').length / MOCK_STUDENTS.length) * 100,
  ),
};

export const MOCK_STUDENT_ACTIVITY: SeriesChartData = {
  labels: ['فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
  values: [58, 64, 70, 75, 82, 88],
};

export const MOCK_AVERAGE_SCORES: SeriesChartData = {
  labels: ['فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
  values: [68, 71, 74, 77, 79, 81],
};

export const MOCK_VIDEO_COMPLETION: SeriesChartData = {
  labels: ['النحو', 'البلاغة', 'الأدب', 'العروض', 'مراجعات'],
  values: [82, 74, 61, 55, 90],
};

export const MOCK_WATCH_TIME: SeriesChartData = {
  labels: ['فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
  values: [320, 410, 455, 500, 610, 705],
};

export const MOCK_PDF_DOWNLOADS: SeriesChartData = {
  labels: ['فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
  values: [90, 130, 160, 175, 210, 260],
};

export const MOCK_EXAM_RESULT_DISTRIBUTION: SeriesChartData = {
  labels: ['ممتاز (90-100)', 'جيد جدًا (80-89)', 'جيد (65-79)', 'مقبول (50-64)', 'ضعيف (أقل من 50)'],
  values: [3, 4, 3, 2, 1],
};

export const MOCK_STAGE_DISTRIBUTION: StageDistributionItem[] = ALL_STAGES.map((stage) => ({
  stage,
  studentCount: MOCK_STUDENTS.filter((s) => s.stage === stage).length,
  videoCount: MOCK_VIDEOS.filter((v) => v.stage === stage).length,
  pdfCount: MOCK_PDFS.filter((p) => p.stage === stage).length,
  examCount: MOCK_EXAMS.filter((e) => e.stage === stage).length,
}));

const rankedStudents: StudentRankEntry[] = [...MOCK_STUDENTS]
  .sort((a, b) => b.averageScore - a.averageScore)
  .map((s) => ({
    studentId: s.id,
    studentName: s.studentName,
    averageScore: s.averageScore,
    progressPercent: s.progressPercent,
  }));

export const MOCK_TOP_STUDENTS: StudentRankEntry[] = rankedStudents.slice(0, 5);
export const MOCK_WEAK_STUDENTS: StudentRankEntry[] = rankedStudents.slice(-5).reverse();
