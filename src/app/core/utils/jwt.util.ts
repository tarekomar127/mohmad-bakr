export interface JwtClaims {
  sub?: string;
  email?: string;
  EducationalStage?: string;
  exp?: number;
  [key: string]: unknown;
}

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

export function jwtRole(claims: JwtClaims): string | undefined {
  return claims[ROLE_CLAIM] as string | undefined;
}

export function isJwtExpired(claims: JwtClaims): boolean {
  if (!claims.exp) return true;
  return claims.exp * 1000 < Date.now();
}
