import { Pipe, PipeTransform } from '@angular/core';
import { StageTarget, stageLabel } from '../../models';

@Pipe({ name: 'stageLabel' })
export class StageLabelPipe implements PipeTransform {
  transform(value: StageTarget | null | undefined): string {
    if (!value) {
      return '-';
    }
    return stageLabel(value);
  }
}
