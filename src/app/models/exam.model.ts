import { QuestionAnswer } from './api.model';

export type QuestionType = 'MCQ' | 'Essay';

export interface Question {
  id: string;
  text: string;
  questionType: QuestionType;
  marks: number;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  correctAnswer: QuestionAnswer | null;
}

export interface QuestionCreateDto {
  text: string;
  questionType: QuestionType;
  marks: number;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  correctAnswer: QuestionAnswer | null;
}

export interface Exam {
  id: string;
  title: string;
  unitId: string;
  unitName: string;
  termId: string;
  termName: string;
  educationalStageId: string;
  stageName: string;
  duration: number;
  totalMarks: number;
  createdAt: string;
  questions: Question[];
}

export interface ExamCreateDto {
  title: string;
  educationalStageId: string;
  termId: string;
  unitId: string;
  duration: number;
  totalMarks: number;
  questions: QuestionCreateDto[];
}

export type ExamUpdateDto = ExamCreateDto;

export interface QuestionAnswerSubmitDto {
  questionId: string;
  selectedAnswer: QuestionAnswer | null;
  textAnswer: string | null;
}

export interface ExamSubmitDto {
  answers: QuestionAnswerSubmitDto[];
}

export interface EssayQuestionGradeDto {
  questionId: string;
  score: number;
}

export interface EssayAnswerGradeDto {
  answers: EssayQuestionGradeDto[];
}
