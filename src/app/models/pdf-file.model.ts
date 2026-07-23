export interface PdfFile {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
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
  educationalStageId: string;
  termId: string;
  unitId: string | null;
}

export type PdfUpdateDto = PdfCreateDto;
