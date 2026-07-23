export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string | null;
  youTubeUrl: string | null;
  youTubeEmbedUrl: string | null;
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
  videoUrl: string | null;
  youTubeUrl: string | null;
  educationalStageId: string;
  termId: string;
  unitId: string;
  duration: number;
  isPublished: boolean;
}

export type VideoUpdateDto = VideoCreateDto;
