export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** 1 = First Preparatory ... 5 = Second Secondary, matching the backend's EducationalStage enum. */
export enum EducationalStage {
  PrepFirst = 1,
  PrepSecond = 2,
  PrepThird = 3,
  SecondaryFirst = 4,
  SecondarySecond = 5,
}

export const STAGE_LABELS: Record<EducationalStage, string> = {
  [EducationalStage.PrepFirst]: 'أولى إعدادي',
  [EducationalStage.PrepSecond]: 'ثانية إعدادي',
  [EducationalStage.PrepThird]: 'ثالثة إعدادي',
  [EducationalStage.SecondaryFirst]: 'أولى ثانوي',
  [EducationalStage.SecondarySecond]: 'ثانية ثانوي',
};

export const ALL_STAGES: EducationalStage[] = [
  EducationalStage.PrepFirst,
  EducationalStage.PrepSecond,
  EducationalStage.PrepThird,
  EducationalStage.SecondaryFirst,
  EducationalStage.SecondarySecond,
];

export function stageLabel(stage: EducationalStage | null | undefined): string {
  return stage ? STAGE_LABELS[stage] : 'جميع الطلاب';
}

/** 1 = Male, 2 = Female, matching the backend's Gender enum. */
export enum Gender {
  Male = 1,
  Female = 2,
}

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.Male]: 'ذكر',
  [Gender.Female]: 'أنثى',
};

/** 1 = OptionA ... 4 = OptionD, matching the backend's QuestionAnswer enum. */
export enum QuestionAnswer {
  A = 1,
  B = 2,
  C = 3,
  D = 4,
}
