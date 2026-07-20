const YOUTUBE_ID_PATTERNS = [
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /youtube(?:-nocookie)?\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
  /youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtube(?:-nocookie)?\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
];

export function extractYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function isYoutubeUrl(url: string | null | undefined): boolean {
  return extractYoutubeId(url) !== null;
}

/**
 * The backend has no dedicated field for a supplementary YouTube explanation link,
 * so it's embedded as a trailing marker inside the video description text.
 */
const EXPLAIN_LINK_PATTERN = /\n\n\[\[youtube_explain:(.+?)\]\]$/;

export function embedExplainLink(description: string, youtubeUrl: string): string {
  const clean = stripExplainLink(description);
  return youtubeUrl ? `${clean}\n\n[[youtube_explain:${youtubeUrl}]]` : clean;
}

export function stripExplainLink(description: string): string {
  return description.replace(EXPLAIN_LINK_PATTERN, '');
}

export function extractExplainLink(description: string | null | undefined): string | null {
  if (!description) return null;
  const match = description.match(EXPLAIN_LINK_PATTERN);
  return match ? match[1] : null;
}
