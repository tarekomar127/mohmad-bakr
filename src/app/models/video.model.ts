export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  lessonId: string;
  lessonName: string;
  unitId: string;
  unitName: string;
  termId: string;
  termName: string;
  educationalStageId: string;
  stageName: string;
  duration: number;
  isPublished: boolean;
  createdAt: string;
}

export interface VideoCreateDto {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  lessonId: string;
  duration: number;
  isPublished: boolean;
}

export type VideoUpdateDto = VideoCreateDto;
