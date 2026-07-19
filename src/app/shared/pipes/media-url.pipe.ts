import { Pipe, PipeTransform } from '@angular/core';
import { resolveMediaUrl } from '../../core/utils/media-url.util';

@Pipe({ name: 'mediaUrl' })
export class MediaUrlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return resolveMediaUrl(value);
  }
}
