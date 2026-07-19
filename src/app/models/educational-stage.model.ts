export enum EducationalStage {
  PrepFirst = 'prep-first',
  PrepSecond = 'prep-second',
  PrepThird = 'prep-third',
  SecondaryFirst = 'secondary-first',
  SecondarySecond = 'secondary-second',
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

export type StageTarget = EducationalStage | 'all';

export function stageLabel(stage: StageTarget): string {
  return stage === 'all' ? 'جميع الطلاب' : STAGE_LABELS[stage];
}
