import credits from '../content/credits.json';

export interface Credit {
  file: string;
  author: string;
  licence: string;
  licenceUrl: string;
  source: string;
}

export const CREDITS = credits as Record<string, Credit>;

/** URL of a downloaded photo, or null so callers fall back to emoji. */
export function photo(id: string): string | null {
  return CREDITS[id] ? `./img/${id}.webp` : null;
}
