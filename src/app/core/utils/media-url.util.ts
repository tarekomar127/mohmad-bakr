import { environment } from '../../../environments/environment';

const API_ORIGIN = environment.apiUrl.replace(/\/api\/?$/, '');

/** Backend returns file paths like "/uploads/..." relative to its own origin, not the frontend's. */
export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
