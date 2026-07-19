import { Pipe, PipeTransform } from '@angular/core';
import { EducationalStage, stageLabel } from '../../models';

@Pipe({ name: 'stageLabel' })
export class StageLabelPipe implements PipeTransform {
  transform(value: EducationalStage | null | undefined): string {
    return stageLabel(value);
  }
}
