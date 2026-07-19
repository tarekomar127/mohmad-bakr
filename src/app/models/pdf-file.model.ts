export interface PdfFile {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  lessonId: string;
  lessonName: string;
  unitId: string;
  unitName: string;
  termId: string;
  termName: string;
  educationalStageId: string;
  stageName: string;
  createdAt: string;
}

export interface PdfCreateDto {
  title: string;
  description: string;
  fileUrl: string;
  lessonId: string;
}

export type PdfUpdateDto = PdfCreateDto;
