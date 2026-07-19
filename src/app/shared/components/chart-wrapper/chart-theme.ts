function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function chartPalette(): string[] {
  return [
    cssVar('--color-primary', '#D90429'),
    '#22C55E',
    '#F59E0B',
    '#3B82F6',
    '#A855F7',
    '#14B8A6',
  ];
}

export function chartBaseOptions() {
  const ink = cssVar('--color-ink', '#222222');
  const inkMuted = cssVar('--color-ink-muted', '#6b6b6b');
  const line = cssVar('--color-line', '#E5E5E5');

  return {
    font: ink,
    muted: inkMuted,
    grid: line,
  };
}
