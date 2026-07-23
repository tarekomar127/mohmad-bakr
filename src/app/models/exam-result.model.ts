import { QuestionAnswer } from './api.model';
import { QuestionType } from './exam.model';

export interface ExamAnswer {
  questionId: string;
  questionType: QuestionType;
  selectedAnswer: QuestionAnswer | null;
  textAnswer: string | null;
  score: number;
  isGraded: boolean;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  examTitle: string;
  score: number;
  percentage: number;
  isPendingManualGrading: boolean;
  solvedAt: string;
  answers: ExamAnswer[];
}
