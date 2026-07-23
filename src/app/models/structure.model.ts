import { EducationalStage } from './api.model';

export interface UnitNode {
  id: string;
  name: string;
}

export interface TermNode {
  id: string;
  name: string;
  units: UnitNode[];
}

export interface StageNode {
  id: string;
  stage: EducationalStage;
  name: string;
  terms: TermNode[];
}

export interface CreateUnitRequest {
  termId: string;
  name: string;
}
