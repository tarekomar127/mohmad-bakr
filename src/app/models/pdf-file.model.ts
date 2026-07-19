import { EducationalStage } from './educational-stage.model';

export interface PdfFile {
  id: string;
  title: string;
  description: string;
  stage: EducationalStage;
  fileUrl: string;
  uploadDate: string;
  downloadCount: number;
}
