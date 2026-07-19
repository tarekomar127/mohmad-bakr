export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  takenAt: string;
}
