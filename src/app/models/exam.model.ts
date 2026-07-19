import { QuestionAnswer } from './api.model';

export interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: QuestionAnswer;
}

export interface QuestionCreateDto {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: QuestionAnswer;
}

export interface Exam {
  id: string;
  title: string;
  lessonId: string;
  lessonName: string;
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
  lessonId: string;
  duration: number;
  totalMarks: number;
  questions: QuestionCreateDto[];
}

export type ExamUpdateDto = ExamCreateDto;

export interface QuestionAnswerSubmitDto {
  questionId: string;
  selectedAnswer: QuestionAnswer;
}

export interface ExamSubmitDto {
  answers: QuestionAnswerSubmitDto[];
}
